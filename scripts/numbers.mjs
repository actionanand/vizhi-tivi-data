import fs from 'node:fs';
import { ROOT, json, assert } from './lib.mjs';
import path from 'node:path';

export function assignNumbers(channels, numbering) {
  const active = {...numbering.active};
  const occupied = new Set(Object.values(active));
  const retiredIDs=new Set(numbering.retired.map(x=>x.id));
  const next = (tamil) => {
    let number = tamil ? 1 : 251;
    const maximum=tamil ? 250 : 2_099_999_999;
    while(occupied.has(number) && number <= maximum) number++;
    if(number>maximum) throw Error('Tamil allocation 1–250 exhausted; no existing numbers changed');
    occupied.add(number);
    return number;
  };
  const updated=structuredClone(channels);
  for(const c of updated.channels){
    assert(!retiredIDs.has(c.id), `Cannot reuse retired channel ID ${c.id}`);
    if(Object.hasOwn(active,c.id)){
      assert(c.number==null || c.number===active[c.id], `Cannot renumber ${c.id}`);
      c.number=active[c.id];
    }else{
      const tamil=c.languages.includes('tam');
      const value=c.number==null ? next(tamil) : c.number;
      assert(Number.isSafeInteger(value) && (tamil ? value>=1 && value<=250 : value>=251), `Invalid number ${value} for ${c.id}`);
      assert(!occupied.has(value) || c.number==null,`Number ${value} already occupied`);
      if(c.number!=null) occupied.add(value);
      c.number=value;
      active[c.id]=value;
    }
  }
  return {channels:updated,numbering:{...numbering,active}};
}

export function retireNumber(id, reason, channels, numbering, when=new Date().toISOString().slice(0,10)){
  assert(typeof reason==='string' && reason.trim().length>=8,'Retirement reason must contain at least 8 characters');
  assert(!channels.channels.some(c=>c.id===id),`Remove ${id} from channels.json and all its streams before retiring its number`);
  assert(Object.hasOwn(numbering.active,id),`No active assignment for ${id}`);
  const next=structuredClone(numbering);
  next.retired.push({id,number:next.active[id],retiredAt:when,reason:reason.trim()});
  delete next.active[id];
  return next;
}

const args=process.argv.slice(2);
if(args[0]==='assign'){
  try{
    const channels=json('data/channels.json');const numbering=json('data/numbering.json');
    const updated=assignNumbers(channels,numbering);
    fs.writeFileSync(path.join(ROOT,'data/channels.json'),JSON.stringify(updated.channels,null,2)+'\n');
    fs.writeFileSync(path.join(ROOT,'data/numbering.json'),JSON.stringify(updated.numbering,null,2)+'\n');
    console.log('Assigned missing channel numbers; existing numbers unchanged. Run npm run validate.');
  } catch(e){console.error(e.message);process.exitCode=1;}
}else if(args[0]==='retire'){
  try{
    const id=args[1],reason=args.slice(2).join(' ');
    assert(id && reason,'Usage: npm run numbers:retire -- <id> <reason with at least 8 characters>');
    const updated=retireNumber(id,reason,json('data/channels.json'),json('data/numbering.json'));
    fs.writeFileSync(path.join(ROOT,'data/numbering.json'),JSON.stringify(updated,null,2)+'\n');
    console.log(`Retired ${id}. The freed number may be reused, but the retired ID must never be reused.`);
  }catch(e){console.error(e.message);process.exitCode=1;}
}else if(args.length){console.error('Usage: node scripts/numbers.mjs assign | retire <id> <reason>');process.exitCode=2;}
