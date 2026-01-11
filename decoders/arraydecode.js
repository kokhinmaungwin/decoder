/* Array Decode */
const utils = {
  strWrap(str) {
    if (typeof str !== 'string') str = String(str);
    if (str.includes("'") && !str.includes('"')) return '"';
    return "'";
  },

  escapeRegExp(str, quote) {
    if (typeof str !== 'string') str = String(str);
    return str.replace(new RegExp(`[\\\\${quote}]`, 'g'), '\\$&');
  },

  methodChain(code) {
    return code;
  },

  quote(string) {
    const escapable = /[\\\"\x00-\x1f\x7f-\uffff]/g;
    const meta = {
      '\b': '\\b',
      '\t': '\\t',
      '\n': '\\n',
      '\f': '\\f',
      '\r': '\\r',
      '"': '\\"',
      '\\': '\\\\'
    };
    escapable.lastIndex = 0;
    return escapable.test(string)
      ? string.replace(escapable, (a) => {
          const c = meta[a];
          return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        })
      : string;
  }
};

export function ArrayDecode(source, options = {}) {
  const detectPattern = /^(var|const|let)\s+([_$a-zA-Z][_$a-zA-Z0-9]*)\s*=\s*(\[[\s\S]*?\]);?/;
  const match = source.match(detectPattern);

  if (!match || match.length < 4) throw new Error('Array variable declaration not found or invalid');

  const varName = match[2];
  const arrayLiteral = match[3];
  const keyPattern = new RegExp(varName.replace(/\$/g, '\\$') + '\\[(\\d+)\\]', 'g');

  // Remove the array declaration from source
  let code = source.replace(detectPattern, '');

  let arr;
  try {
    arr = eval(arrayLiteral);
  } catch (e) {
    throw new Error('Array parsing failed: ' + e.message);
  }

  // Replace all array[index] with corresponding string literals (escaped & quoted)
  code = code.replace(keyPattern, (_, index) => {
    const item = arr[index];
    const quoteChar = utils.strWrap(item);
    return quoteChar + utils.quote(item) + quoteChar;
  });

  if (options.methodChain) {
    code = utils.methodChain(code);
  }

  return code;
}
