import test from 'node:test';
import assert from 'node:assert/strict';
import {PRODUCTS} from '../src/catalog.mjs';
import {normalizeItems,calculateTotals,validateCustomer,searchProducts,CART_TTL_MS,MAX_PER_PRODUCT} from '../src/core.mjs';

const addr={name:'Camille Dupont',email:'camille@example.com',street:'12 rue de la Paix',city:'Lyon',postal:'69003',phone:'06 12 34 56 78'};

test('catalog contains 30 unique products, exactly 5 per category',()=>{
 assert.equal(PRODUCTS.length,30);
 assert.equal(new Set(PRODUCTS.map(x=>x.id)).size,30);
 assert.deepEqual(Object.values(Object.groupBy(PRODUCTS,x=>x.category)).map(a=>a.length),[5,5,5,5,5,5]);
 assert.ok(PRODUCTS.every(p=>Number.isInteger(p.priceCents)&&p.priceCents>0));
});
test('server ignores forged client prices and recomputes cents and delivery',()=>{
 const t=calculateTotals([{id:'aurora-headphones',quantity:2,priceCents:1}]);
 assert.equal(t.subtotalCents,37800);assert.equal(t.shippingCents,0);assert.equal(t.totalCents,37800);
 const low=calculateTotals([{id:'essential-tee',quantity:1}]);assert.equal(low.subtotalCents,3900);assert.equal(low.shippingCents,690);assert.equal(low.totalCents,4590);
});
test('shopping threshold exactly 100€ gives free shipping',()=>{
 const t=calculateTotals([{id:'flow-mat',quantity:1},{id:'essential-tee',quantity:1},{id:'cacao-box',quantity:1}]);
 assert.equal(t.subtotalCents,12200);assert.equal(t.shippingCents,0);
});
test('cart rejects unknown ID, invalid qty, excess, empty and polluted shapes',()=>{
 for(const items of [[],[{id:'not-a-product',quantity:1}],[{id:'flow-mat',quantity:0}],[{id:'flow-mat',quantity:1.5}],[{id:'flow-mat',quantity:100}],[{id:'flow-mat',quantity:7},{id:'flow-mat',quantity:4}]])assert.throws(()=>normalizeItems(items));
 assert.deepEqual(normalizeItems([{id:'flow-mat',quantity:1,priceCents:-100},{id:'flow-mat',quantity:2}]),[{id:'flow-mat',quantity:3}]);
 assert.equal(CART_TTL_MS,604800000);assert.equal(MAX_PER_PRODUCT,10);
});
test('customer validation accepts French formatting and neutralizes control characters',()=>{
 assert.deepEqual(validateCustomer({...addr,name:'Camille\u0000 Dupont'}).name,'Camille Dupont');
 for(const bad of [{postal:'1234'},{phone:'123456'},{email:'not-email'},{street:'<script>'},{city:'A'},{name:'X'}])assert.throws(()=>validateCustomer({...addr,...bad}));
});
test('search is accent insensitive and combines category with sorting',()=>{
 const r=searchProducts({query:'Café',category:'food'});assert.equal(r.length,1);assert.equal(r[0].id,'origin-coffee');
 const s=searchProducts({category:'sports',sort:'price-asc'});assert.equal(s.length,5);assert.ok(s.every((x,i)=>i===0||s[i-1].priceCents<=x.priceCents));
});

test('private local concierge provides existing product ids, without API keys',async()=>{
 const {recommendProducts}=await import('../src/recommender.mjs');
 const ids=recommendProducts('un cadeau sport à petit budget');
 assert.equal(ids.length,3);assert.equal(new Set(ids).size,3);
 assert.ok(ids.every(id=>PRODUCTS.some(p=>p.id===id)));
});
