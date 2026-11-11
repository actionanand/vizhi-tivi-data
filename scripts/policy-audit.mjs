import { loadAll, publicView } from './lib.mjs';
try {
  const src=loadAll(), pub=publicView(src);
  const channels=new Set(pub.catalogue.channels.map(x=>x.id));
  const streams=new Set(pub.streamDoc.streams.map(x=>x.id));
  for(const rev of src.revocations.entries.filter(x=>x.status==='active')){
    if(rev.targetType==='channel' && channels.has(rev.target)) throw Error(`Revoked channel published: ${rev.target}`);
    if(rev.targetType==='stream' && streams.has(rev.target)) throw Error(`Revoked stream published: ${rev.target}`);
    if(rev.targetType==='host' && pub.streamDoc.streams.some(s=>new URL(s.url).hostname===rev.target)) throw Error(`Revoked host published: ${rev.target}`);
  }
  console.log(`Rights audit OK: ${src.revocations.entries.filter(x=>x.status==='active').length} active exclusions checked; published ${channels.size} channels / ${streams.size} streams.`);
} catch(e){console.error(`Policy audit failed: ${e.message}`);process.exitCode=1;}
