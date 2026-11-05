import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const file = path => readFileSync(new URL('../'+path, import.meta.url),'utf8');

test('free settings keep all paid integrations disabled',()=>{
  const worker=file('wrangler.toml.example');
  assert.match(worker,/LIVE_COMMERCE_ENABLED\s*=\s*"false"/);
  assert.match(worker,/STOCK_READY\s*=\s*"false"/);
  assert.match(worker,/AUTO_FULFILL\s*=\s*"false"/);
  assert.match(worker,/AI_ASSISTANT_ENABLED\s*=\s*"false"/);
});
test('public user interface discloses demo checkout and local concierge',()=>{
  const html=file('index.html');
  assert.match(html,/commande d[eé]mo ne d[eé]clenche ni paiement ni exp[eé]dition/i);
  assert.match(html,/Suggestions locales par d[eé]faut/i);
  assert.match(html,/<a class="skip-link"/);
});
test('backend protects live checkout behind explicit enablement',()=>{
  const worker=file('worker/index.mjs');
  assert.match(worker,/LIVE_COMMERCE_ENABLED==='true'/);
  assert.match(worker,/STOCK_READY==='true'/);
  assert.match(worker,/AI_ASSISTANT_ENABLED!=='true'/);
  assert.match(worker,/AUTO_FULFILL!=='true'/);
});
