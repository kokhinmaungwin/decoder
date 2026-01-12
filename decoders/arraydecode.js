/* === Advanced Array Decode === */
export function ArrayDecode(source, options = {}) {
  let code = source;

  function decodeEscapedString(str) {
    
    str = str.replace(/\\x([0-9A-Fa-f]{2})/g, (m, h) => String.fromCharCode(parseInt(h, 16)));

    str = str.replace(/\\u([0-9A-Fa-f]{4})/g, (m, u) => String.fromCharCode(parseInt(u, 16)));
    return str;
  }

  /* ----------------------------------
   STEP 1 — Collect all array literals
  ----------------------------------- */
  const arrayDecl = /(var|const|let)\s+([_$a-zA-Z][_$a-zA-Z0-9]*)\s*=\s*(\[[\s\S]*?\]);?/g;
  let arrays = {};
  let m;

  while ((m = arrayDecl.exec(source))) {
    try {
      arrays[m[2]] = eval(m[3]);   // hex & unicode auto decoded
    } catch {}
  }

  if (!Object.keys(arrays).length) {
    throw new Error("No arrays found");
  }

  /* remove array declarations */
  code = code.replace(arrayDecl, "");

  /* ----------------------------------
   STEP 2 — Execute array rotations
   (function(a,b){ while(--b) a.push(a.shift()) })(arr, N)
  ----------------------------------- */
  code = code.replace(
    /\(function\(\w+,\w+\)\{[\s\S]*?push\(\w+\.shift\(\)\)[\s\S]*?\}\(([_$a-zA-Z0-9]+),\s*(\d+)\)\);?/g,
    (_, name, n) => {
      const arr = arrays[name];
      if (!arr) return _;
      for(let i = 0; i < Number(n); i++) arr.push(arr.shift());
      delete arrays[name];
      return "";
    }
  );

  /* ----------------------------------
   STEP 3 — Merge arrays (a = a.concat(b))
  ----------------------------------- */
  code = code.replace(
    /([_$a-zA-Z]\w*)\s*=\s*\1\.concat\(([_$a-zA-Z]\w*)\);?/g,
    (_, a, b) => {
      if (arrays[a] && arrays[b]) {
        arrays[a] = arrays[a].concat(arrays[b]);
        delete arrays[b];
      }
      return "";
    }
  );

  /* ----------------------------------
   STEP 4 — Replace arr[index]
  ----------------------------------- */
  for (const name in arrays) {
    const arr = arrays[name];
    const re = new RegExp(name.replace(/\$/g, "\\$") + "\\[(0x[0-9a-fA-F]+|\\d+)\\]", "g");

    code = code.replace(re, (_, idx) => {
      const i = idx.startsWith("0x") ? parseInt(idx, 16) : Number(idx);
      let item = arr[i];
      if (typeof item === "string") {
        item = decodeEscapedString(item);
      }
      return JSON.stringify(item);
    });
  }

  /* ----------------------------------
   Remove global accessor for function calls (window[], self[], etc.)
  ----------------------------------- */
  code = code.replace(
    /\b(?:window|self|this|globalThis)\s*\[\s*["']([a-zA-Z_$][\w$]*)["']\s*\]\s*\(/g,
    '$1('
  );

  /* ----------------------------------
   STEP 5 — Flatten while(true)+switch
  ----------------------------------- */
code = code.replace(
  /var\s+(_0xindex)\s*=\s*\d+;\s*while\s*\(true\)\s*\{\s*switch\s*\(\1\)\s*\{([\s\S]*?)\}\s*\}/g,
  (_, indexVar, body) => {
    let out = [];
    body.replace(/case\s+\d+:\s*([\s\S]*?)break;/g, (_, c) => {
      const cleaned = c.replace(new RegExp(indexVar + '\\s*=\\s*\\d+;?', 'g'), '').trim();
      out.push(cleaned);
    });
    return out.join('\n');
  }
);

  return code;
}
