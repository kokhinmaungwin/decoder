// decoders/sourcemap.js
const fs = require('fs');
const { SourceMapConsumer } = require('source-map');

async function decodeWithSourceMap(jsFile, mapFile) {
  const mapRaw = JSON.parse(fs.readFileSync(mapFile, 'utf8'));

  if (!mapRaw.sourcesContent) {
    console.log('[!] No sourcesContent in source map');
    return;
  }

  console.log('✅ Decoded source:\n');
  mapRaw.sourcesContent.forEach((src, i) => {
    console.log(`// ===== source ${i} =====\n`);
    console.log(src);
  });
}

module.exports = decodeWithSourceMap;
