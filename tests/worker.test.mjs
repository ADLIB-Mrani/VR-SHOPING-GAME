import test from 'node:test';
import assert from 'node:assert/strict';
import api,{verifyStripeSignature} from '../worker/index.mjs';

const encoder=new TextEncoder();
async function signature(body,secret,timestamp=Math.floor(Date.now()/1000)){
 const key=await crypto.subtle.importKey('raw',encoder.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 const bytes=await crypto.subtle.sign('HMAC',key,encoder.encode(`${timestamp}.${body}`));
 return `t=${timestamp},v1=${Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('')}`;
}
const origin='https://nova.example';
const customer={name:'Camille Dupont',email:'camille@example.com',street:'12 rue Exemple',city:'Lyon',postal:'69003',phone:'0612345678'};
function fakeDb(){
 const orders=new Map(),events=new Map();
 function execute(sql,args,op){
  if(op==='first'){
   if(sql.startsWith('SELECT id FROM stripe_events'))return events.has(args[0])?{id:args[0]}:null;
   if(sql.includes('FROM orders WHERE id='))return orders.get(args[0])||null;
   return null;
  }
  if(op==='all')return {results:[...orders.values()]};
  if(sql.startsWith('INSERT INTO orders')){
   const [id,created,updated,status,subtotal,shipping,total,items,person,hash]=args;
   orders.set(id,{id,created_at:created,updated_at:updated,status,subtotal_cents:subtotal,shipping_cents:shipping,total_cents:total,items_json:items,customer_json:person,token_hash:hash,stripe_session_id:null,tracking_number:null,tracking_url:null});
  } else if(sql.startsWith('INSERT OR IGNORE INTO stripe_events')){
   events.set(args[0],args[1]);
  } else if(sql.startsWith('UPDATE orders SET stripe_session_id')){
   orders.get(args[2]).stripe_session_id=args[0];
  } else if(sql.startsWith('UPDATE orders SET status=')){
   const o=orders.get(args[1]);if(o)o.status=sql.includes("status='paid'")?'paid':sql.includes("status='cancelled'")?'cancelled':'checkout_error';
  }
  return {success:true};
 }
 return {orders,events,prepare(sql){return {
  bind(...args){return {
   run:async()=>execute(sql,args,'run'),first:async()=>execute(sql,args,'first'),all:async()=>execute(sql,args,'all')
  }}
 }}};
}
const env=(db)=>({DB:db,PUBLIC_WEB_ORIGIN:origin,PUBLIC_STORE_URL:origin,LIVE_COMMERCE_ENABLED:'true',STOCK_READY:'true',STRIPE_SECRET_KEY:'sk_test_fake',STRIPE_WEBHOOK_SECRET:'whsec_testing',ADMIN_API_TOKEN:'test_admin_token',AUTO_FULFILL:'false'});

test('Stripe signature accepts a genuine HMAC and rejects tampered/stale signatures',async()=>{
 const payload='{"id":"evt_1"}',key='whsec_test',ts=Math.floor(Date.now()/1000),signed=await signature(payload,key,ts);
 assert.equal(await verifyStripeSignature(payload,signed,key,ts),true);
 assert.equal(await verifyStripeSignature(payload+' ',signed,key,ts),false);
 assert.equal(await verifyStripeSignature(payload,signed,key,ts+301),false);
});
test('health reports safe default mode when secrets or stock missing',async()=>{
 const response=await api.fetch(new Request(origin+'/api/status'),{});const data=await response.json();assert.equal(data.commerceEnabled,false);
 const denied=await api.fetch(new Request(origin+'/api/checkout',{method:'POST',headers:{Origin:origin}}),{PUBLIC_WEB_ORIGIN:origin});assert.equal(denied.status,503);
});
test('CORS rejects foreign checkout origins',async()=>{
 const response=await api.fetch(new Request(origin+'/api/checkout',{method:'POST',headers:{Origin:'https://attacker.example'}}),env(fakeDb()));assert.equal(response.status,403);
});
test('Stripe Checkout uses trusted catalog, private lookup token and verified webhook',async()=>{
 const db=fakeDb(),config=env(db);const fetchBefore=globalThis.fetch;let charged;
 globalThis.fetch=async(url,options)=>{assert.match(url,/stripe.com/);charged=new URLSearchParams(options.body);return new Response(JSON.stringify({id:'cs_test_42',url:'https://checkout.stripe.com/c/pay/cs_test_42'}),{status:200})};
 try{
  const payload={items:[{id:'aurora-headphones',quantity:1,priceCents:1}],customer};
  const response=await api.fetch(new Request(origin+'/api/checkout',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(payload)}),config);
  assert.equal(response.status,200);const data=await response.json();assert.match(data.accessToken,/^[a-f0-9]{64}$/);assert.equal(charged.get('line_items[0][price_data][unit_amount]'),'18900');
  const id=data.orderId,stored=db.orders.get(id);assert.equal(stored.total_cents,18900);assert.ok(!JSON.stringify(data).includes('0612345678'));
  const invalid=await api.fetch(new Request(origin+`/api/orders/${id}`,{headers:{Origin:origin,Authorization:'Bearer '+'0'.repeat(64)}}),config);assert.equal(invalid.status,404);
  const pending=await api.fetch(new Request(origin+`/api/orders/${id}`,{headers:{Origin:origin,Authorization:'Bearer '+data.accessToken}}),config);assert.equal((await pending.json()).status,'pending');
  const event={id:'evt_verified',type:'checkout.session.completed',data:{object:{id:'cs_test_42',metadata:{order_id:id},client_reference_id:id,amount_total:18900,currency:'eur',payment_status:'paid'}}};
  const raw=JSON.stringify(event);const webhook=await api.fetch(new Request(origin+'/api/webhooks/stripe',{method:'POST',headers:{'stripe-signature':await signature(raw,config.STRIPE_WEBHOOK_SECRET)},body:raw}),config);
  assert.equal(webhook.status,200);assert.equal(db.orders.get(id).status,'paid');assert.equal(db.events.size,1);
  const duplicate=await api.fetch(new Request(origin+'/api/webhooks/stripe',{method:'POST',headers:{'stripe-signature':await signature(raw,config.STRIPE_WEBHOOK_SECRET)},body:raw}),config);assert.equal((await duplicate.json()).duplicate,true);
 }finally{globalThis.fetch=fetchBefore}
});
