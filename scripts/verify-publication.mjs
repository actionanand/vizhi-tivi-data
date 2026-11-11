import fs from 'node:fs';
import path from 'node:path';
import { ROOT, LOCALES, publicView, loadAll } from './lib.mjs';
try {
  const actual=publicView(loadAll());
  const base=path.join(ROOT,'dist','site');
  const read=(p)=>JSON.parse(fs.readFileSync(path.join(base,p),'utf8'));
  const checks=[['manifest.json',actual.manifest],['schema/catalogue-v1.schema.json',actual.schemaDoc.catalogue],
    ['schema/streams-v1.schema.json',actual.schemaDoc.streams],
    ['catalog/v1/catalogue.json',actual.catalogue],
    ['catalog/v1/streams.json',actual.streamDoc],
    ...LOCALES.map(l=>[`catalog/v1/locales/${l}.json`,actual.localeDoc[l]])];
  for(const [p,obj] of checks){
    if(JSON.stringify(read(p))!==JSON.stringify(obj)) throw Error(`stale or unexpected publish output: ${p}`);
  }
  if(!fs.existsSync(path.join(base,'index.html')) || !fs.existsSync(path.join(base,'.nojekyll'))) throw Error('site shell missing');
  console.log(`Reproducible publication verified: ${checks.length} JSON files, site index and .nojekyll`);
} catch(e){console.error(`Publication verification failed: ${e.message}`);process.exitCode=1;}
