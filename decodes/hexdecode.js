/* Hex Decode */
export function decodeHexDeep(input, maxLoop = 50) {
  let code = input.trim();
  let loop = 0;
  let changed = true;

  while (changed && loop < maxLoop) {
    loop++;
    changed = false;

    // \xNN
    code = code.replace(/\\\\x([0-9A-Fa-f]{2})|\\x([0-9A-Fa-f]{2})/g, (_,h1,h2) => {
      const h = h1 || h2;
      return String.fromCharCode(parseInt(h, 16));
    });

    // \uXXXX
    code = code.replace(/\\\\u([0-9A-Fa-f]{4})|\\u([0-9A-Fa-f]{4})/g, (_,h1,h2) => {
      const h = h1 || h2;
      return String.fromCharCode(parseInt(h, 16));
    });

    // [0x68,0x65,...]
    code = code.replace(/\[(\s*0x[0-9A-Fa-f]{2}\s*,?)+\]/g, m => {
      changed = true;
      return m
        .match(/0x[0-9A-Fa-f]{2}/g)
        .map(h => String.fromCharCode(parseInt(h, 16)))
        .join("");
    });

    // "68 65 6c 6c 6f"
    code = code.replace(/"([0-9A-Fa-f\s]{2,})"/g, (m, hexStr) => {
      const clean = hexStr.replace(/\s+/g, "");
      if (clean.length % 2 !== 0) return m;

      let out = "";
      for (let i = 0; i < clean.length; i += 2) {
        out += String.fromCharCode(parseInt(clean.substr(i, 2), 16));
      }

      changed = true;
      return `"${out}"`;
    });
  }

  return code;   
}
