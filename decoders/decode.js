// decode.js
const decodeWithSourceMap = require('./sourcemap');

const jsFile = process.argv[2];
const mapFile = process.argv[3];

if (!jsFile || !mapFile) {
  console.log('Usage: node decode.js output.js output.js.map');
  process.exit(1);
}

decodeWithSourceMap(jsFile, mapFile);
