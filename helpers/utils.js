/* utils.js */
export function strWrap(str) {
  if (typeof str !== 'string') str = String(str);
  if (str.includes("'") && !str.includes('"')) return '"';
  return "'";
}

export function escapeRegExp(str, quote) {
  if (typeof str !== 'string') str = String(str);
  return str.replace(new RegExp(`[\\\\${quote}]`, 'g'), '\\$&');
}

export function calcHex(str) {
  return str.replace(/0x[a-f\d]+/gi, (match) => {
    return parseInt(match, 16);
  });
}

export function _unescape(str) {
  try {
    return unescape(str);
  } catch {
    return str;
  }
}

export function toBool(str) {
  if (str === "true" || str === "false") return str;
  return str;
}

export function propArr(str) {
  
  return str;
}

export function strMerge(str) {

  return str;
}

export function calcNumber(str) {
  
  return str;
}

export function methodChain(str) {
  if (typeof str !== "string") return str;

  let prev;
  let cur = str;

  do {
    prev = cur;

    cur = cur.replace(
      /(['"`])([^'"`\\]*)\1\s*\+\s*\1([^'"`\\]*)\1/g,
      (_, q, a, b) => q + a + b + q
    );

    cur = cur.replace(
      /(["'])([^"'\\]*)\1\s*\+\s*(["'])([^"'\\]*)\3/g,
      (_, q1, a, q2, b) => q1 + a + b + q1
    );

  } while (cur !== prev);

  return cur;
}
