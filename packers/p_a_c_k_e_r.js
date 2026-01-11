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

    if (!this.detect(str)) return str;

    try {
      // Fake eval function that collects unpacked code
      const fakeEval = (code) => {
        unpackedSource += code;
        return unpackedSource;
      };

      // Replace eval calls in the packed code with fakeEval
      const replacedStr = str.replace(/\beval\b/g, 'fakeEval');

      // Use Function constructor to run replaced code with access to fakeEval
      const exec = new Function('fakeEval', replacedStr);
      exec(fakeEval);

      if (typeof unpackedSource === 'string' && unpackedSource.length) {
        str = unpackedSource;
      }
    } catch (e) {
      // silently fail – return original packed code
    }

    return str;
  }

};
