import {PRODUCTS,CATEGORIES} from './catalog.mjs';
/** Deterministic, private recommendations: works offline and without AI billing. */
export function recommendProducts(query){
 const q=String(query||'').slice(0,220).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const tags={electronics:['tech','musique','audio','telephone','photo','ordinateur','cadeau geek','ecouteur','video'],clothing:['mode','vetement','basket','chaussure','sneaker','style','sac','accessoire','porter'],home:['maison','lampe','bureau','deco','interieur','cadeau design','meuble'],food:['cafe','the','cuisine','manger','gourmand','chocolat','boisson','matcha'],books:['lecture','livre','lire','inspiration','culture','roman','architecture'],sports:['fitness','sport','entrainement','yoga','musculation','fitness','bien etre','bouger']};
 const inexpensive=/petit budget|pas cher|moins de 50|abordable|economique|budget/.test(q);
 return [...PRODUCTS].map(p=>{
  const words=[p.name,p.description].join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  let score=p.featured?1:0;
  for(const w of q.split(/[^a-z0-9]+/).filter(w=>w.length>2))if(words.includes(w))score+=4;
  for(const w of tags[p.category]||[])if(q.includes(w))score+=3;
  if(inexpensive)score+=p.priceCents<=5000?6:-4;
  return {p,score};
 }).sort((a,b)=>b.score-a.score||a.p.priceCents-b.p.priceCents).slice(0,3).map(x=>x.p.id);
}
