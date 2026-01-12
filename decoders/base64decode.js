/* Base64 decode.js */
export function decodeBase64Deep(input, maxLoop = 20) {
  let code = input.trim();
  let loop = 0;
  let changed = true;

  function safeAtobUnicode(b64) {
    const bin = atob(b64);
    return decodeURIComponent(
      Array.prototype.map
        .call(bin, c => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
  }

  function isBase64(s) {
    s = s.replace(/\s+/g, "");
    return s.length >= 8 && s.length % 4 === 0 && /^[A-Za-z0-9+/]+={0,2}$/.test(s);
  }

  while (changed && loop++ < maxLoop) {
    changed = false;

    // add this block to decode pure base64 string ONLY
    if (isBase64(code)) {
      try {
        const dec = safeAtobUnicode(code);
        // avoid decoding garbage binary
        if (!/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(dec)) {
          code = dec;
          changed = true;
          continue;
        }
      } catch {
        // ignore errors
      }
    }

    // existing code for atob("...")
    code = code.replace(
      /atob\s*\(\s*(['"])([A-Za-z0-9+/=]+)\1\s*\)/g,
      (m, q, b64) => {
        if (!isBase64(b64)) return m;
        const decoded = safeAtobUnicode(b64);
        changed = true;
        return JSON.stringify(decoded);
      }
    );

    // "SGVsbG8=" or 'SGVsbG8='
    code = code.replace(
      /(["'])([A-Za-z0-9+/]{8,}={0,2})\1/g,
      (m, q, b64) => {
        try {
          if (!isBase64(b64)) return m;
          const dec = safeAtobUnicode(b64);
          if (/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(dec)) return m;
          changed = true;
          return q + dec.replace(/\\/g,"\\\\").replace(/"/g,'\\"') + q;
        } catch {
          return m;
        }
      }
    );

    // remove eval(atob("...")) → just atob("...")
    code = code.replace(
      /eval\s*\(\s*(atob\s*\(\s*(['"`])[\s\S]*?\2\s*\))\s*\)/g,
      (_, inner) => {
        changed = true;
        return inner;
      }
    );
    
  }

  return code;
}
