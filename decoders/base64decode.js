/* Base64 Decode - ERROR SAFE */
export function decodeBase64Deep(input, maxLoop = 50) {
  if (typeof input !== "string") {
    throw new Error("Base64 input must be a string");
  }

  let code = input.trim();
  let loop = 0;
  let changed = true;
  let decodedOnce = false;

  function safeAtob(str) {
    try {
      str = str.replace(/\s+/g, "");
      return decodeURIComponent(
        Array.prototype.map
          .call(atob(str), c =>
            "%" + c.charCodeAt(0).toString(16).padStart(2, "0")
          )
          .join("")
      );
    } catch (e) {
      throw new Error("Invalid Base64 string");
    }
  }

  function isBase64(str) {
    str = str.replace(/\s+/g, "");
    return (
      str.length >= 8 &&
      str.length % 4 === 0 &&
      /^[A-Za-z0-9+/]+={0,2}$/.test(str)
    );
  }

  while (changed && loop < maxLoop) {
    loop++;
    changed = false;

    // raw base64
    if (isBase64(code)) {
      const decoded = safeAtob(code);
      if (decoded !== code) {
        code = decoded;
        changed = true;
        decodedOnce = true;
        continue;
      }
    }

    // atob("...")
    code = code.replace(
      /atob\s*\(\s*(['"`])([\s\S]*?)\1\s*\)/g,
      (m, q, b64) => {
        if (!isBase64(b64)) return m;
        decodedOnce = true;
        changed = true;
        return JSON.stringify(safeAtob(b64));
      }
    );

    // eval(atob("..."))
    code = code.replace(
      /eval\s*\(\s*(atob\s*\([\s\S]*?\))\s*\)/g,
      (_, inner) => {
        changed = true;
        return inner;
      }
    );
  }

  if (!decodedOnce) {
    throw new Error("No valid Base64 content found");
  }

  return code;
}
