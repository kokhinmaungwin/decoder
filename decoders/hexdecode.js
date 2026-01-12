/* Hex Decode */
export function decodeHexDeep(input, maxLoop = 50) {
  let code = input.trim();
  let loop = 0;
  let changed = true;

  while (changed && loop < maxLoop) {
    loop++;
    changed = false;

    // \xNN
    code = code.replace(/\\x([0-9A-Fa-f]{2})/g, (m, h) => {
      changed = true;
      return String.fromCharCode(parseInt(h, 16));
    });

    // \uXXXX (Unicode escape)
    code = code.replace(/\\u([\dA-Fa-f]{4})/g, (m, u) => {
      changed = true;
      return String.fromCharCode(parseInt(u, 16));
    });

    // 0xNN array → string
    code = code.replace(
      /\[(\s*0x[0-9A-Fa-f]{2}\s*,?)+\]/g,
      (m) => {
        changed = true;
        return m
          .match(/0x[0-9A-Fa-f]{2}/g)
          .map(h => String.fromCharCode(parseInt(h, 16)))
          .join("");
      }
    );

    // pure hex string
    if (/^[0-9A-Fa-f\s]+$/.test(code) && code.replace(/\s+/g, '').length % 2 === 0) {
      try {
        let hex = code.replace(/\s+/g, '');
        let out = '';
        for (let i = 0; i < hex.length; i += 2) {
          out += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        code = out;       
        changed = true;   
      } catch {
    
      }
    }
  }

  return code;
}
