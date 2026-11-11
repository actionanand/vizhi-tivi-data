import fs from 'node:fs';
import path from 'node:path';
import { ROOT, LOCALES, loadAll, publicView } from './lib.mjs';

export function writeBuild(root=ROOT){
  const {catalogue,streamDoc,localeDoc,schemaDoc,manifest}=publicView(loadAll(root));
  const target=path.join(root,'dist','site');
  fs.rmSync(target,{recursive:true,force:true});
  fs.mkdirSync(path.join(target,'catalog','v1','locales'),{recursive:true});
  fs.mkdirSync(path.join(target,'schema'),{recursive:true});
  const write=(p,obj)=>fs.writeFileSync(path.join(target,p),JSON.stringify(obj,null,2)+'\n');
  write('catalog/v1/catalogue.json',catalogue);
  write('catalog/v1/streams.json',streamDoc);
  write('manifest.json',manifest);
  write('schema/catalogue-v1.schema.json',schemaDoc.catalogue);
  write('schema/streams-v1.schema.json',schemaDoc.streams);
  for(const lang of LOCALES) write(`catalog/v1/locales/${lang}.json`,localeDoc[lang]);
  fs.writeFileSync(path.join(target,'.nojekyll'),'');
  fs.writeFileSync(path.join(target,'index.html'), `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Vizhi TiVi Data</title>
<style>body{font-family:system-ui,sans-serif;background:#101827;color:#f5f7fc;max-width:750px;margin:6rem auto;padding:1rem}a{color:#83d2fb}code{background:#253046;padding:.2rem .4rem;border-radius:.3rem}</style>
</head><body><h1>Vizhi TiVi · Data API</h1><p>The world before your eyes.</p>
<p>Published channels: <strong>${manifest.channelCount}</strong> · Approved streams: <strong>${manifest.streamCount}</strong></p>
<p>This public API publishes only reviewed, legally eligible Live TV sources. Research leads and private imported IPTV playlists are never included.</p>
<p><a href="manifest.json">Manifest</a> · <a href="catalog/v1/catalogue.json">Channels</a> · <a href="catalog/v1/streams.json">Streams</a></p>
<small>Catalogue schema v1 · SHA-256: <code>${manifest.contentSha256.slice(0,16)}</code></small></body></html>
`);
  console.log(`Built ${target}: ${manifest.channelCount} channels / ${manifest.streamCount} streams; digest ${manifest.contentSha256}`);
  return manifest;
}
if(process.argv[1] && path.resolve(process.argv[1])===path.resolve(new URL(import.meta.url).pathname)) writeBuild();
