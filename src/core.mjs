import {PRODUCT_BY_ID,PRODUCTS} from './catalog.mjs';
export const SHIPPING_CENTS=690;
export const FREE_SHIPPING_FROM_CENTS=10000;
export const MAX_PER_PRODUCT=10;
export const MAX_CART_LINES=30;
export const CART_TTL_MS=7*24*60*60*1000;
export function normalizeItems(items){
 if(!Array.isArray(items)||items.length>MAX_CART_LINES) throw new Error('Panier invalide');
 const combined=new Map();
 for(const item of items){
  if(!item||typeof item.id!=='string'||!PRODUCT_BY_ID[item.id]||!Number.isInteger(item.quantity)||item.quantity<1||item.quantity>MAX_PER_PRODUCT) throw new Error('Article ou quantité invalide');
  const next=(combined.get(item.id)||0)+item.quantity;
  if(next>MAX_PER_PRODUCT) throw new Error('Quantité maximale dépassée');
  combined.set(item.id,next);
 }
 if(combined.size===0) throw new Error('Le panier est vide');
 return [...combined].map(([id,quantity])=>({id,quantity}));
}
export function calculateTotals(items){
 const lines=normalizeItems(items).map(({id,quantity})=>({id,quantity,name:PRODUCT_BY_ID[id].name,unitCents:PRODUCT_BY_ID[id].priceCents,subtotalCents:PRODUCT_BY_ID[id].priceCents*quantity}));
 const subtotalCents=lines.reduce((sum,line)=>sum+line.subtotalCents,0);
 const shippingCents=subtotalCents>=FREE_SHIPPING_FROM_CENTS?0:SHIPPING_CENTS;
 return {lines,subtotalCents,shippingCents,totalCents:subtotalCents+shippingCents,currency:'eur'};
}
export function validateCustomer(value){
 if(!value||typeof value!=='object') throw new Error('Coordonnées manquantes');
 const cleaned={};
 for(const [key,min,max] of [['name',3,100],['email',6,200],['street',5,180],['city',2,100],['postal',5,5],['phone',10,20]]){
  const v=value[key];
  if(typeof v!=='string') throw new Error(`Champ ${key} requis`);
  cleaned[key]=v.trim().replace(/[\u0000-\u001f\u007f]/g,'');
  if(cleaned[key].length<min||cleaned[key].length>max) throw new Error(`Champ ${key} invalide`);
 }
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned.email)) throw new Error('Email invalide');
 if(!/^\d{5}$/.test(cleaned.postal)) throw new Error('Code postal français invalide');
 if(!/^(?:\+33|0)[1-9](?:[\s.\-]?\d{2}){4}$/.test(cleaned.phone)) throw new Error('Téléphone français invalide');
 if(/[<>]/.test(cleaned.name+cleaned.street+cleaned.city)) throw new Error('Caractères non autorisés');
 return cleaned;
}
export function searchProducts({query='',category='all',sort='featured',maxPrice=Infinity}={}){
 const needle=String(query).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
 const matches=PRODUCTS.filter(p=>(category==='all'||p.category===category)&&p.priceCents<=maxPrice*100&&([p.name,p.description,p.category].join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes(needle)));
 if(sort==='price-asc') matches.sort((a,b)=>a.priceCents-b.priceCents);
 if(sort==='price-desc') matches.sort((a,b)=>b.priceCents-a.priceCents);
 if(sort==='name') matches.sort((a,b)=>a.name.localeCompare(b.name,'fr'));
 if(sort==='featured') matches.sort((a,b)=>Number(b.featured)-Number(a.featured));
 return matches;
}
export const euro=cents=>new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(cents/100);
