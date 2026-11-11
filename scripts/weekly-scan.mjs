import fs from 'node:fs';
import path from 'node:path';
import { ROOT, json, loadAll, checkedHttps, validateAll } from './lib.mjs';

async function probe(raw,label){
  checkedHttps(raw,label);
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),7000);
  try {
    const response=await fetch(raw,{method:'HEAD',redirect:'manual',signal:controller.signal,headers:{'User-Agent':'VizhiTiVi-Catalogue-Audit/1.0'}});
    await response.body?.cancel();
    return {status:response.status,ok:response.ok,redirect:response.status>=300 && response.status<400};
  } catch(e){return {status:null,ok:false,error:String(e?.message||e).slice(0,180)};}
  finally{clearTimeout(timer);}
}

try {
  const sourceRegistry=json('research/source-registry.json');
  const all=loadAll();validateAll(all);
  const targets=[
    ...sourceRegistry.sources.map(s=>({type:'official-directory',id:s.id,url:s.url})),
    ...all.streams.streams.map(s=>({type:'reviewed-stream',id:s.id,url:s.url}))
  ];
  const results=[];
  for(const target of targets) results.push({...target,health:await probe(target.url,`${target.type}/${target.id}`)});
  const report={scannedAt:new Date().toISOString(),readonly:true,
    notice:'Reachability does not establish stream rights, playback correctness, or approval. Never auto-promote trial/unverified streams.',
    examined:targets.length,results};
  fs.mkdirSync(path.join(ROOT,'reports'),{recursive:true});
  fs.writeFileSync(path.join(ROOT,'reports','weekly-scan.json'),JSON.stringify(report,null,2)+'\n');
  console.log(`Weekly research scan completed: ${results.length} URLs; report is review-only`);
  for(const r of results) console.log(`${r.type}/${r.id}: ${r.health.status || r.health.error || 'unknown'}`);
} catch(e){console.error(`Weekly scan failed: ${e.message}`);process.exitCode=1;}
