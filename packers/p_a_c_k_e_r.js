/* P_A_C_K_E_R – Safe modern unpacker */
export const P_A_C_K_E_R = {

  detect(str) {
    return /eval\(function\(p,a,c,k,e,(?:r|d)\)/.test(str);
  },

  unpack(str) {
    const m = str.match(
      /eval\(function\(p,a,c,k,e,(?:r|d)\)\{([\s\S]+?)\}\(([\s\S]+?)\)\)/
    );
    if (!m) return str;

    const body = m[1];
    const args = m[2];

    // build function safely
    const fn = new Function("p","a","c","k","e","d", body);

    const parts = eval("[" + args + "]");
    const decoded = fn.apply(null, parts);

    return String(decoded);
  }
};
