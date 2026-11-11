import { loadAll, validateAll } from './lib.mjs';
try {
  const r=validateAll(loadAll());
  console.log(`Validated source: ${r.channelCount} approved metadata channels, ${r.streamCount} source streams, 3 locale files`);
  console.log('Research candidates are not part of public catalogue.');
} catch (e) {console.error(`Validation failed: ${e.message}`);process.exitCode=1;}
