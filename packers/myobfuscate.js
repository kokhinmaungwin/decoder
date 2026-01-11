/* MyObfuscate */
export const MyObfuscate = {
  detect(str) {
    if (/^var _?[0O1lI]{3}\=('|\[).*\)\)\);/.test(str)) {
      return true;
    }
    if (/^function _?[0O1lI]{3}\(_/.test(str) && /eval\(/.test(str)) {
      return true;
    }
    return false;
  },

  unpack(str) {
    if (!MyObfuscate.detect(str)) return str;

    const originalEval = eval;

    try {
      // override eval temporarily
      eval = function (unpacked) { // eslint-disable-line no-eval
        if (MyObfuscate.startsWith(unpacked, 'var _escape')) {
          const matches = /'([^']*)'/.exec(unpacked);
          if (matches) {
            let unescaped = unescape(matches[1]);

            if (MyObfuscate.startsWith(unescaped, '<script>')) {
              unescaped = unescaped.slice(8);
            }
            if (MyObfuscate.endsWith(unescaped, '</script>')) {
              unescaped = unescaped.slice(0, -9);
            }

            unpacked = unescaped;
          }
        }

        unpacked =
          "// ⚠️ Unpacker warning: be careful using myobfuscate.com\n" +
          "// free version scripts may call back home\n\n" +
          unpacked;

        throw unpacked; // stop execution
      };

      originalEval(str);
    } catch (e) {
      if (typeof e === 'string') {
        str = e;
      }
    } finally {
      eval = originalEval; // ✅ 반드시 restore
    }

    return str;
  },

  startsWith(str, what) {
    return str.slice(0, what.length) === what;
  },

  endsWith(str, what) {
    return str.slice(-what.length) === what;
  }
};
