import test from 'node:test';
import assert from 'node:assert/strict';
import {assignNumbers, retireNumber} from '../scripts/numbers.mjs';

const ch=(id,langs,number=null)=>({id,languages:langs,number});
const ledger=()=>({schemaVersion:1,active:{},retired:[]});
test('Tamil slots are 1–250, other languages start 251',()=>{
  const o=assignNumbers({schemaVersion:1,channels:[ch('tamil-one',['tam']),ch('hindi-one',['hin']),ch('tamil-two',['tam'])]},ledger());
  assert.deepEqual(o.channels.channels.map(x=>x.number),[1,251,2]);
});
test('assignment order changes do not renumber existing IDs',()=>{
  const l={schemaVersion:1,active:{'tamil-one':7,'hindi-one':259},retired:[]};
  const o=assignNumbers({schemaVersion:1,channels:[ch('hindi-one',['hin']),ch('tamil-one',['tam'])]},l);
  assert.deepEqual(o.channels.channels.map(x=>x.number),[259,7]);
});
test('new Tamil channel fills earliest vacant number without renumbering',()=>{
  const l={schemaVersion:1,active:{'tamil-one':1,'tamil-three':3},retired:[]};
  const o=assignNumbers({schemaVersion:1,channels:[ch('tamil-one',['tam']),ch('tamil-three',['tam']),ch('tamil-two',['tam'])]},l);
  assert.deepEqual(o.channels.channels.map(x=>x.number),[1,3,2]);
});
test('retire requires explicit removal and reason',()=>{
  const l={schemaVersion:1,active:{'tamil-one':1},retired:[]};
  assert.throws(()=>retireNumber('tamil-one','Closed channel',{channels:[ch('tamil-one',['tam'])]},l),/Remove/);
  assert.throws(()=>retireNumber('tamil-one','short',{channels:[]},l),/at least 8/);
});
test('permanent retirement archives ID and frees number',()=>{
  const l={schemaVersion:1,active:{'tamil-one':1},retired:[]};
  const r=retireNumber('tamil-one','Permanently closed',{channels:[]},l,'2026-10-15');
  assert.deepEqual(r.retired[0],{id:'tamil-one',number:1,retiredAt:'2026-10-15',reason:'Permanently closed'});
  assert.equal(r.active['tamil-one'],undefined);
  const out=assignNumbers({schemaVersion:1,channels:[ch('tamil-two',['tam'])]},r);
  assert.equal(out.channels.channels[0].number,1);
});
test('retired ID cannot silently return',()=>{
  const l={schemaVersion:1,active:{},retired:[{id:'tamil-one',number:1,retiredAt:'2026-10-15',reason:'closed'}]};
  assert.throws(()=>assignNumbers({schemaVersion:1,channels:[ch('tamil-one',['tam'])]},l),/retired channel ID/);
});
test('Tamil allocation fails when all 250 numbers occupied',()=>{
  const active=Object.fromEntries(Array.from({length:250},(_,i)=>[`existing-${i}`,i+1]));
  assert.throws(()=>assignNumbers({schemaVersion:1,channels:[ch('extra-tamil',['tam'])]}, {schemaVersion:1,active,retired:[]}),/exhausted/);
});
test('manually colliding number is rejected',()=>{
  assert.throws(()=>assignNumbers({schemaVersion:1,channels:[ch('new-tamil',['tam'],1)]},{schemaVersion:1,active:{'old-tamil':1},retired:[]}),/occupied/);
});
