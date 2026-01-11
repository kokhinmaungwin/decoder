// obfuscatorio.js
import * as utils from './utils.js';

export function ObfuscatorIO(source, options = {}) {
  const detectPattern = /((?![^_a-zA-Z$])[\w$]*)\(-?('|")(0x[a-f\d]+|\\x30\\x78[\\xa-f\d]+)\2(\s*,\s*('|").+?\5)?\)/gi;
  let detectMatch = source.match(detectPattern);

  if (!detectMatch) throw new Error('Not matched');

  detectMatch = detectMatch.map((i) => i.replace(/\(.+?\)$/, ''));
  detectMatch = detectMatch.filter((i, pos) => detectMatch.indexOf(i) === pos && i !== '');

  if (detectMatch.length === 1) {
    const varIndex = source.search(funcDefinerPattern(detectMatch[0]));
    const { headVar, mainCode } = getHeadVar(varIndex, source);

    if (funcDefinerPattern(detectMatch[0]).test(headVar)) {
      return decode(
        {
          headCode: headVar,
          mainCode,
        },
        options,
        detectPattern,
      );
    }
  }

  return decode(splitMultiVar(detectMatch, source), options, detectPattern);
}

ObfuscatorIO.detect = function (source) {
  try {
    return !!source.match(/((?![^_a-zA-Z$])[\w$]*)\(-?('|")(0x[a-f\d]+|\\x30\\x78[\\xa-f\d]+)\2/gi);
  } catch {
    return false;
  }
};

ObfuscatorIO.unpack = function (source, options = {}) {
  return ObfuscatorIO(source, options);
};

function decode({ headCode, mainCode }, options, detectPattern) {
  headCode = headCode.replace(/\b(const|let)(\s*(?![^_a-zA-Z$])[\w$]*=)/gi, 'var $2');
  eval(headCode);

  mainCode = mainCode.split(';');
  mainCode = mainCode.map((piece) => {
    piece = piece.replace(detectPattern, (key) => {
      const item = eval(key);
      const q = utils.strWrap(item);
      return q + utils.escapeRegExp(item, q) + q;
    });

    if (options.calc) piece = utils.calcHex(piece);
    if (options._unescape) piece = utils._unescape(piece);
    piece = utils.toBool(piece);
    piece = utils.propArr(piece);

    return piece;
  });
  mainCode = mainCode.join(';');

  if (options.strMerge) mainCode = utils.strMerge(mainCode);
  if (options.calc) mainCode = utils.calcNumber(mainCode);
  if (options.methodChain) mainCode = utils.methodChain(mainCode);

  return mainCode;
}

function funcDefinerPattern(key, flags = 'i') {
  return new RegExp('\\b(var|const|let)\\s+' + key + '\\s*=\\s*function\\s*\\(.*?\\)\\s*', flags);
}

function splitMultiVar(detectMatch, source) {
  let keyStore = [];

  for (const key of detectMatch) {
    const { sourceVar, keyVar } = getVarDefiner(key, source);
    source = sourceVar;
    keyStore = keyStore.concat(keyVar);

    const { sourceFunc, keyFunc } = getFuncDefiner(key, source);
    source = sourceFunc;
    keyStore = keyStore.concat(keyFunc);
  }

  if (!keyStore.length) throw new Error('Key not found');

  let bodyVar = '';
  let headVarStore = {};
  for (const obj of keyStore) {
    bodyVar += obj.code;
    const returnIndex = source.search(funcDefinerPattern(obj.return));
    if (returnIndex !== -1) {
      headVarStore[obj.return] = returnIndex;
    }
  }

  if (Object.keys(headVarStore).length !== 1) throw new Error('Multiple or no function definitions found');

  const { headVar, mainCode } = getHeadVar(Object.values(headVarStore)[0], source);

  return {
    headCode: headVar + bodyVar,
    mainCode,
  };
}

function getHeadVar(pos, source) {
  let bo = 0,
    bc = 0,
    sourceSize = source.length,
    headVar,
    mainCode;

  const splitSource = (pos) => {
    headVar = source.slice(0, pos);
    mainCode = source.slice(pos);
  };

  while (pos < sourceSize) {
    if (source.charAt(pos) === '{') bo++;
    if (source.charAt(pos) === '}') bc++;
    if (bc === bo && bo !== 0) {
      splitSource(pos + 2);
      break;
    }
    pos++;
  }

  if (!mainCode) throw new Error('Not splits');
  return { headVar, mainCode };
}

function getVarDefiner(key, source) {
  const varPattern = '\\b(var|const|let)\\s+' + key + '\\s*=\\s*((?!\\d)[a-z\\d_$]*?)(;|,)';
  const varGroupPattern = new RegExp(varPattern, 'gi');

  let keyVar = [];
  let sourceVar = source;

  if (varGroupPattern.test(source)) {
    sourceVar = source.replace(varGroupPattern, (m) => {
      const varMatch = m.match(new RegExp(varPattern, 'i'));
      keyVar.push({
        key,
        return: varMatch[2],
        code: varMatch[0].replace(/,$/, ';'),
      });

      if (m.slice(-1) === ';') return '';
      return varMatch[1] + ' ';
    });
  }

  return { sourceVar, keyVar };
}

function getFuncDefiner(key, source) {
  const funcGroupPattern = funcDefinerPattern(key, 'gi');

  let keyFunc = [];
  let sourceFunc = source;

  while (funcGroupPattern.test(source)) {
    const varIndex = source.search(funcDefinerPattern(key));
    const sourceSize = source.length;

    if (varIndex === -1) throw new Error('Not found');

    let pos = varIndex,
      bo = 0,
      bc = 0;

    const splitSource = (pos) => {
      sourceFunc = source.slice(0, varIndex) + source.slice(pos);
      const varFunc = source.slice(varIndex, pos);
      const returnMatch = varFunc.match(/(return\s+((?![^_a-zA-Z$])[\w$]*))(?![\s\S]*return)/i);
      keyFunc.push({
        key,
        return: returnMatch[2],
        code: varFunc,
      });

      source = sourceFunc;
    };

    while (pos < sourceSize) {
      if (source.charAt(pos) === '{') bo++;
      if (source.charAt(pos) === '}') bc++;
      if (bc === bo && bo !== 0) {
        splitSource(pos + 2);
        break;
      }
      pos++;
    }
  }

  return { sourceFunc, keyFunc };
}

if (typeof self !== 'undefined') {
  self.ObfuscatorIO = ObfuscatorIO;
}
