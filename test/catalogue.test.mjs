import test from 'node:test';
import assert from 'node:assert/strict';
import {loadAll, validateAll, publicView} from '../scripts/lib.mjs';

const clone=()=>structuredClone(loadAll());
function activeChannel(id='tamil-example',num=1,lang='tam') {
  return {id,number:num,name:'Example Test Channel',languages:[lang],country:'IN',category:'news',
    status:'active',website:'https://station.example.org/',sourceUrls:['https://station.example.org/terms']};
}
function stream(id='test-hls',channelId='tamil-example'){
  return {id,channelId,url:'https://media.example.org/stream.m3u8',format:'hls',rightsStatus:'approved',
    rightsEvidenceUrl:'https://station.example.org/license',verificationStatus:'verified',
    experimental:false,lastVerifiedAt:'2026-01-01'};
}
function ready(){
  const x=clone();x.channels.channels.push(activeChannel());x.numbering.active['tamil-example']=1;
  x.streams.streams.push(stream());return x;
}

test('empty starter is valid and publishes no broadcaster streams',()=>{
  const x=clone(); assert.deepEqual(validateAll(x),{channelCount:0,streamCount:0});
  const v=publicView(x); assert.equal(v.manifest.channelCount,0);assert.equal(v.manifest.streamCount,0);
});
test('rights-approved and verified stream becomes public',()=>{
  const x=ready(),view=publicView(x);
  assert.equal(view.catalogue.channels[0].number,1);
  assert.deepEqual(view.catalogue.channels[0].streamIds,['test-hls']);
  assert.equal(view.streamDoc.streams[0].playbackStatus,'verified');
});
test('metadata channel without any eligible stream is excluded',()=>{
  const x=ready();x.streams.streams=[];
  assert.equal(publicView(x).catalogue.channels.length,0);
});
test('non-Tamil channel must start at 251',()=>{
  const x=clone();x.channels.channels.push(activeChannel('hindi-example',250,'hin'));x.numbering.active['hindi-example']=250;
  assert.throws(()=>validateAll(x),/non-Tamil must start/);
});
test('Tamil channel cannot exceed 250',()=>{
  const x=ready();x.channels.channels[0].number=251;x.numbering.active['tamil-example']=251;
  assert.throws(()=>validateAll(x),/Tamil must be/);
});
test('duplicate number is rejected',()=>{
  const x=ready();x.channels.channels.push(activeChannel('tamil-second',1));x.numbering.active['tamil-second']=1;
  assert.throws(()=>validateAll(x),/duplicate channel number/);
});
test('immutable ledger mismatch is rejected',()=>{
  const x=ready();x.numbering.active['tamil-example']=2;
  assert.throws(()=>validateAll(x),/immutable numbering mismatch/);
});
test('stream with unconfirmed redistribution rights is rejected',()=>{
  const x=ready();x.streams.streams[0].rightsStatus='unconfirmed';
  assert.throws(()=>validateAll(x),/no unapproved streams/);
});
test('signed or credential-bearing stream URLs are rejected',()=>{
  const x=ready();x.streams.streams[0].url='https://media.example.org/live.m3u8?access_token=secret';
  assert.throws(()=>validateAll(x),/signed\/tokenized/);
});
test('HTTP and local network sources are rejected',()=>{
  const x=ready();x.streams.streams[0].url='http://media.example.org/live.m3u8';
  assert.throws(()=>validateAll(x),/only HTTPS/);
  x.streams.streams[0].url='https://127.0.0.1/live.m3u8';
  assert.throws(()=>validateAll(x),/public DNS/);
});
test('rights-approved trial is clearly experimental',()=>{
  const x=ready();x.streams.streams[0].verificationStatus='trial';x.streams.streams[0].experimental=true;
  assert.equal(publicView(x).streamDoc.streams[0].playbackStatus,'experimental');
});
test('unlabeled trial is rejected',()=>{
  const x=ready();x.streams.streams[0].verificationStatus='trial';
  assert.throws(()=>validateAll(x),/trial must be experimental/);
});
test('revoked channel excludes channel and its streams',()=>{
  const x=ready();x.revocations.entries.push({id:'notice-one',targetType:'channel',target:'tamil-example',
    status:'active',date:'2026-10-01',reason:'Rights holder notice',evidenceUrl:'https://station.example.org/notice'});
  assert.equal(publicView(x).manifest.channelCount,0);
});
test('revoked stream excludes its channel when no other streams remain',()=>{
  const x=ready();x.revocations.entries.push({id:'notice-one',targetType:'stream',target:'test-hls',
    status:'active',date:'2026-10-01',reason:'Rights holder notice',evidenceUrl:'https://station.example.org/notice'});
  assert.equal(publicView(x).manifest.streamCount,0);
});
test('revoked exact host excludes its stream',()=>{
  const x=ready();x.revocations.entries.push({id:'notice-one',targetType:'host',target:'media.example.org',
    status:'active',date:'2026-10-01',reason:'Host takedown notice',evidenceUrl:'https://station.example.org/notice'});
  assert.equal(publicView(x).manifest.streamCount,0);
});
test('cleared revocation no longer blocks',()=>{
  const x=ready();x.revocations.entries.push({id:'notice-one',targetType:'stream',target:'test-hls',
    status:'cleared',date:'2026-10-01',reason:'Rights restored following review',evidenceUrl:'https://station.example.org/notice'});
  assert.equal(publicView(x).manifest.streamCount,1);
});
test('locale keys must be identical',()=>{
  const x=clone();delete x.locales.ta.search;
  assert.throws(()=>validateAll(x),/keys differ/);
});
test('digest independent of source insertion order and unused research',()=>{
  const x=ready();const first=publicView(x).manifest.contentSha256;
  const again=publicView(structuredClone(x)).manifest.contentSha256;
  assert.equal(first,again);
});
test('published changes modify digest but research-only changes cannot',()=>{
  const x=ready();const old=publicView(x).manifest.contentSha256;
  x.channels.channels[0].name='Another Test Name';
  assert.notEqual(publicView(x).manifest.contentSha256,old);
});
