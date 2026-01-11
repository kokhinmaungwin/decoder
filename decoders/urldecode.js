/* URL Decode */
export const Urlencoded = {

  detect(str) {
    if (!str || typeof str !== 'string') return false;

    // no literal spaces, but encoded ones
    if (str.indexOf(' ') === -1) {
      // common URL encodings
      if (/%2[0-9a-f]/i.test(str)) return true;
      if ((str.match(/%[0-9a-f]{2}/gi) || []).length >= 3) return true;
    }
    return false;
  },

  unpack(str) {
    if (!this.detect(str)) return str;

    try {
      // "+" handling:
      // if "+" was escaped as %2B, preserve "+"
      if (/%2b/i.test(str)) {
        return decodeURIComponent(str.replace(/\+/g, '%20'));
      }

      return decodeURIComponent(str);
    } catch (e) {
      // decoding failed → return original safely
      return str;
    }
  }

};
