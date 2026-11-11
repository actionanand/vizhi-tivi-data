import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { isIP } from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const CATEGORIES = new Set(['general', 'news', 'sports', 'music', 'kids', 'entertainment', 'education', 'culture', 'religious', 'other']);
export const LOCALES = ['en', 'ta', 'sa'];
export const API_VERSION = 1;
const ID = /^[a-z0-9][a-z0-9-]{2,99}$/;

export function assert(ok, message) {
  if (!ok) throw new Error(message);
}
export function json(file, root=ROOT) {
  return JSON.parse(readFileSync(path.join(root, file), 'utf8'));
}
export function isId(v) { return typeof v === 'string' && ID.test(v); }
export function isISODate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value + 'T00:00:00Z');
  return Number.isFinite(d.getTime()) && d.toISOString().slice(0,10) === value;
}
export function checkedHttps(input, label) {
  assert(typeof input === 'string', `${label}: expected HTTPS URL`);
  let url;
  try { url = new URL(input); } catch { throw new Error(`${label}: invalid URL`); }
  assert(url.protocol === 'https:', `${label}: only HTTPS is allowed`);
  assert(!url.username && !url.password && !url.hash, `${label}: credentials/fragments not permitted`);
  const host = url.hostname.replace(/^\[|\]$/g,'').toLowerCase();
  assert(host.includes('.') && !isIP(host) && !/(^|\.)(localhost|local|internal|test|invalid)$/.test(host), `${label}: host is not public DNS`);
  assert(url.port === '' || url.port === '443', `${label}: non-HTTPS port not allowed`);
  for (const key of url.searchParams.keys()) {
    assert(!/(token|secret|password|signature|api[_-]?key|access[_-]?key|auth|expires|session)/i.test(key),
      `${label}: signed/tokenized URLs must never be published`);
  }
  return url;
}
function nonempty(x,label) {assert(typeof x === 'string' && x.trim() !== '', `${label}: required string`);}
function array(x,label){assert(Array.isArray(x),`${label}: expected array`);}
function schemaVersion(x,label){assert(x?.schemaVersion === API_VERSION,`${label}: schemaVersion must be ${API_VERSION}`);}
function dupCheck(records,label){const ids = new Set(); for(const record of records){assert(isId(record.id),`${label}: invalid ID`); assert(!ids.has(record.id),`${label}: duplicate ID ${record.id}`); ids.add(record.id);}}

export function validateAll(input) {
  const {channels, streams, numbering, revocations, locales, schemas} = input;
  assert(schemas && schemas.catalogue && schemas.streams, 'Public JSON Schemas missing');
  assert(schemas.catalogue.properties?.schemaVersion?.const === 1, 'Catalogue schema version mismatch');
  assert(schemas.streams.properties?.schemaVersion?.const === 1, 'Streams schema version mismatch');
  for(const [name,obj] of [['channels',channels],['streams',streams],['numbering',numbering],['revocations',revocations]]) schemaVersion(obj,name);
  array(channels.channels,'channels.channels');
  array(streams.streams,'streams.streams');
  array(numbering.retired,'numbering.retired');
  array(revocations.entries,'revocations.entries');
  assert(numbering.active && typeof numbering.active === 'object' && !Array.isArray(numbering.active), 'numbering.active invalid');
  dupCheck(channels.channels,'channel');
  dupCheck(streams.streams,'stream');
  dupCheck(revocations.entries,'revocation');
  const seenNumbers=new Set(), channelIDs=new Set();
  for(const channel of channels.channels){
    const tag=`channel ${channel.id}`;
    channelIDs.add(channel.id);
    nonempty(channel.name,`${tag}.name`);
    assert(Number.isSafeInteger(channel.number) && channel.number >= 1,`${tag}: missing/invalid number; run npm run numbers:assign`);
    array(channel.languages,`${tag}.languages`);
    assert(channel.languages.length >= 1 && channel.languages.every(v=>typeof v==='string' && /^[a-z]{3}$/.test(v)), `${tag}: use ISO 639-3 language codes`);
    assert(new Set(channel.languages).size === channel.languages.length,`${tag}: duplicate language`);
    if(channel.languages.includes('tam')) assert(channel.number <= 250, `${tag}: Tamil must be in 1–250`);
    else assert(channel.number >= 251, `${tag}: non-Tamil must start at 251`);
    assert(!seenNumbers.has(channel.number),`${tag}: duplicate channel number ${channel.number}`);
    seenNumbers.add(channel.number);
    assert(/^[A-Z]{2}$/.test(channel.country),`${tag}: ISO 3166-1 alpha-2 country required`);
    assert(CATEGORIES.has(channel.category),`${tag}: unknown category`);
    assert(channel.status === 'active',`${tag}: active channels only; retire removed channels explicitly`);
    checkedHttps(channel.website,`${tag}.website`);
    array(channel.sourceUrls,`${tag}.sourceUrls`);
    assert(channel.sourceUrls.length > 0,`${tag}: source evidence required`);
    channel.sourceUrls.forEach((url,i)=>checkedHttps(url,`${tag}.sourceUrls[${i}]`));
    if(channel.logoUrl != null) checkedHttps(channel.logoUrl,`${tag}.logoUrl`);
    assert(numbering.active[channel.id] === channel.number,`${tag}: immutable numbering mismatch`);
  }
  const activeNums=new Set();
  for(const [id,number] of Object.entries(numbering.active)){
    assert(isId(id) && channelIDs.has(id),`numbering.active: missing channel ${id}`);
    assert(Number.isSafeInteger(number) && !activeNums.has(number),`numbering.active: duplicate/invalid number`);
    activeNums.add(number);
  }
  const retiredIDs=new Set();
  for(const item of numbering.retired){
    assert(isId(item.id) && Number.isSafeInteger(item.number) && item.number>0,'retired record malformed');
    nonempty(item.reason,`retired ${item.id}.reason`);
    assert(isISODate(item.retiredAt),`retired ${item.id}: date invalid`);
    assert(!retiredIDs.has(item.id) && !channelIDs.has(item.id),`retired ${item.id}: cannot reuse retired ID`);
    retiredIDs.add(item.id);
  }
  const streamIds=new Set();
  for(const stream of streams.streams){
    const tag=`stream ${stream.id}`;
    assert(channelIDs.has(stream.channelId),`${tag}: unknown channelId`);
    checkedHttps(stream.url,`${tag}.url`);
    assert(['hls','dash','progressive'].includes(stream.format),`${tag}: unsupported format`);
    assert(stream.rightsStatus === 'approved',`${tag}: no unapproved streams in source data; research belongs in research/`);
    checkedHttps(stream.rightsEvidenceUrl,`${tag}.rightsEvidenceUrl`);
    assert(['verified','trial'].includes(stream.verificationStatus),`${tag}: invalid verificationStatus`);
    assert(stream.verificationStatus !== 'trial' || stream.experimental === true,`${tag}: trial must be experimental`);
    assert(stream.verificationStatus !== 'verified' || stream.experimental !== true,`${tag}: verified stream cannot be experimental`);
    assert(isISODate(stream.lastVerifiedAt),`${tag}: valid lastVerifiedAt required`);
    assert(stream.lastVerifiedAt <= new Date().toISOString().slice(0,10),`${tag}: verification date in the future`);
    streamIds.add(stream.id);
  }
  for(const rev of revocations.entries){
    assert(['channel','stream','host'].includes(rev.targetType),`revocation ${rev.id}: invalid targetType`);
    nonempty(rev.target,`revocation ${rev.id}.target`);
    if(rev.targetType !== 'host') assert(isId(rev.target),`revocation ${rev.id}: invalid ID target`);
    else {
      const hostname = checkedHttps(`https://${rev.target}/`,`revocation ${rev.id}.host`).hostname;
      assert(hostname===rev.target.toLowerCase(),`revocation ${rev.id}: exact hostname required`);
    }
    assert(['active','cleared'].includes(rev.status),`revocation ${rev.id}: invalid status`);
    nonempty(rev.reason,`revocation ${rev.id}.reason`);
    assert(isISODate(rev.date),`revocation ${rev.id}: date invalid`);
    checkedHttps(rev.evidenceUrl,`revocation ${rev.id}.evidenceUrl`);
  }
  assert(locales && typeof locales==='object', 'locales missing');
  const enKeys=Object.keys(locales.en||{}).sort();
  assert(enKeys.length>0,'English locale empty');
  for(const lang of LOCALES){
    const l=locales[lang];
    assert(l && typeof l==='object' && !Array.isArray(l),`locale ${lang} missing`);
    assert(JSON.stringify(Object.keys(l).sort())===JSON.stringify(enKeys),`locale ${lang} keys differ from en`);
    for(const [key,value] of Object.entries(l)) nonempty(value,`locale ${lang}.${key}`);
  }
  assert(locales.en.tagline === 'The world before your eyes.', 'English tagline altered');
  assert(locales.ta.tagline === 'உலகம் உங்கள் விழிகளில்!', 'Tamil tagline altered');
  assert(locales.sa.tagline === 'विश्वं तव नयनयोः पुरतः', 'Sanskrit tagline altered');
  return {channelCount:channels.channels.length,streamCount:streams.streams.length};
}

export function loadAll(root=ROOT) {
  return {
    channels:json('data/channels.json',root),
    streams:json('data/streams.json',root),
    numbering:json('data/numbering.json',root),
    revocations:json('rights/revocations.json',root),
    schemas:{catalogue:json('schema/catalogue-v1.schema.json',root),streams:json('schema/streams-v1.schema.json',root)},
    locales:Object.fromEntries(LOCALES.map(l=>[l,json(`data/locales/${l}.json`,root)]))
  };
}

export function publicView(input){
  validateAll(input);
  const blocks=input.revocations.entries.filter(x=>x.status==='active');
  const bannedChannels=new Set(blocks.filter(x=>x.targetType==='channel').map(x=>x.target));
  const bannedStreams=new Set(blocks.filter(x=>x.targetType==='stream').map(x=>x.target));
  const bannedHosts=new Set(blocks.filter(x=>x.targetType==='host').map(x=>x.target.toLowerCase()));
  const streams=input.streams.streams.filter(s=>
    !bannedChannels.has(s.channelId) && !bannedStreams.has(s.id) && !bannedHosts.has(new URL(s.url).hostname.toLowerCase())
  ).sort((a,b)=>a.channelId.localeCompare(b.channelId)||a.id.localeCompare(b.id));
  const streamsByChannel=new Map();
  for(const s of streams){
    if(!streamsByChannel.has(s.channelId)) streamsByChannel.set(s.channelId,[]);
    streamsByChannel.get(s.channelId).push(s.id);
  }
  const channels=input.channels.channels.filter(c=>!bannedChannels.has(c.id) && streamsByChannel.has(c.id))
    .sort((a,b)=>a.number-b.number || a.id.localeCompare(b.id));
  const publicStreams=streams.filter(s=>channels.some(c=>c.id===s.channelId)).map(s=>({
    id:s.id,channelId:s.channelId,url:s.url,format:s.format,
    playbackStatus:s.verificationStatus==='trial'?'experimental':'verified',
    lastVerifiedAt:s.lastVerifiedAt,rightsEvidenceUrl:s.rightsEvidenceUrl
  }));
  const publicChannels=channels.map(c=>({
    id:c.id,number:c.number,name:c.name,languages:c.languages,country:c.country,
    region:c.region||null,category:c.category,broadcaster:c.broadcaster||null,
    website:c.website,logoUrl:c.logoUrl||null,sourceUrls:c.sourceUrls,
    streamIds:streamsByChannel.get(c.id)
  }));
  const catalogue={schemaVersion:API_VERSION,channels:publicChannels};
  const streamDoc={schemaVersion:API_VERSION,streams:publicStreams};
  const localeDoc=Object.fromEntries(LOCALES.map(l=>[l,input.locales[l]]));
  const schemaDoc=input.schemas;
  const contentSha256=createHash('sha256').update(JSON.stringify({catalogue,streamDoc,localeDoc,schemaDoc})).digest('hex');
  const manifest={schemaVersion:API_VERSION,contentSha256,channelCount:publicChannels.length,
    streamCount:publicStreams.length,uiLocales:LOCALES,
    numbering:{tamil:{start:1,end:250},other:{start:251}},
    paths:{catalogue:'catalog/v1/catalogue.json',streams:'catalog/v1/streams.json',
      schemas:{catalogue:'schema/catalogue-v1.schema.json',streams:'schema/streams-v1.schema.json'},
      locales:Object.fromEntries(LOCALES.map(l=>[l,`catalog/v1/locales/${l}.json`]))}};
  return {catalogue,streamDoc,localeDoc,schemaDoc,manifest};
}
