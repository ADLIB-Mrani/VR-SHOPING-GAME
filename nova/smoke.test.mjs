import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const html=await readFile(new URL('./index.html',import.meta.url),'utf8');
test('HTML est en français, responsive et contient le showroom WebXR',()=>{
 assert.match(html,/<html lang="fr">/);
 assert.match(html,/name="viewport"/);
 assert.match(html,/aframe\.io\/releases\//);
 assert.match(html,/a-scene/);
 assert.match(html,/laser-controls/);
});
test('L’interface inclut les six catégories, le panier et la recherche',()=>{
 for(const x of ['electronics','clothing','home','food','books','sports'])assert.ok(html.includes(x));
 for(const x of ['id="cart"','id="search"','id="catalog"','id="checkout-dialog"','id="history"'])assert.ok(html.includes(x));
});
test('Le magasin ne demande pas de paiement et indique la démo',()=>{
 assert.match(html,/Démonstration uniquement/);
 assert.match(html,/aucun paiement/i);
 assert.doesNotMatch(html,/sk_(?:live|test)_[A-Za-z0-9]+/);
 assert.doesNotMatch(html,/OPENAI_API_KEY\s*=/);
});
test('30 références uniques figurent dans le catalogue',()=>{
 const match=html.match(/const raw=\[([\s\S]*?)\];\s*const COLORS/);
 assert.ok(match);
 const all=[...match[1].matchAll(/\['([^']+)',\d+,'(?:electronics|clothing|home|food|books|sports)'/g)].map(x=>x[1]);
 assert.equal(all.length,30);
 assert.equal(new Set(all).size,30);
});
