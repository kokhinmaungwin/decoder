/* P_A_C_K_E_R */
export const P_A_C_K_E_R = {

  detect(str) {
    return this.getChunks(str).length > 0;
  },

  getChunks(str) {
    const regex =
      /eval\(\(?function\(.*?(?:,0,\{\}\)\)|split\('\|'\)\)\))(?=$|\n)/g;
    const chunks = str.match(regex);
    return chunks || [];
  },

  unpack(str) {
    const chunks = this.getChunks(str);
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i].replace(/\n$/, '');
      const unpacked = this.unpackChunk(chunk);
      str = str.split(chunk).join(unpacked);
    }
    return str;
  },

  unpackChunk(str) {
    let unpackedSource = '';
    const originalEval = eval;

    if (!this.detect(str)) return str;

    try {
      eval = function (s) { // eslint-disable-line no-eval
        unpackedSource += s;
        return unpackedSource;
      };

      originalEval(str);

      if (typeof unpackedSource === 'string' && unpackedSource.length) {
        str = unpackedSource;
      }
    } catch (e) {
      // silently fail – return original
    } finally {
      eval = originalEval; // ✅ always restore
    }

    return str;
  }

};
