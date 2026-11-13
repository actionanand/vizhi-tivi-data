import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {execFileSync} from 'node:child_process';
import {ROOT} from '../scripts/lib.mjs';
import {writeBuild} from '../scripts/build.mjs';

test('publication is stable, contains only approved output, and never research',()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'vizhi-data-'));
  try{
    fs.cpSync(path.join(ROOT,'data'),path.join(root,'data'),{recursive:true});
    fs.cpSync(path.join(ROOT,'rights'),path.join(root,'rights'),{recursive:true});
    fs.cpSync(path.join(ROOT,'schema'),path.join(root,'schema'),{recursive:true});
    fs.cpSync(path.join(ROOT,'scripts'),path.join(root,'scripts'),{recursive:true});
    execFileSync(process.execPath,[path.join(root,'scripts','build.mjs')]);
    assert(fs.existsSync(path.join(root,'dist','site','manifest.json')));
    const first=writeBuild(root);const second=writeBuild(root);
    assert.equal(first.contentSha256,second.contentSha256);
    assert.equal(first.channelCount,0);
    const files=[];
    const walk=(p)=>{for(const x of fs.readdirSync(p,{withFileTypes:true})){
      const f=path.join(p,x.name);if(x.isDirectory())walk(f);else files.push(path.relative(root,f));
    }};
    walk(path.join(root,'dist/site'));
    assert(files.some(x=>x.endsWith(path.join('catalog','v1','catalogue.json'))));
    assert(!files.some(x=>x.includes('research')||x.includes('candidate')||x.includes('revocations')));
    const catalogue=JSON.parse(fs.readFileSync(path.join(root,'dist/site/catalog/v1/catalogue.json'),'utf8'));
    assert.deepEqual(catalogue.channels,[]);
  }finally{fs.rmSync(root,{recursive:true,force:true});}
});
