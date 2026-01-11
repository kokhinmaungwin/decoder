/* AA Decode */
export const AADecode = {
  decode(text) {
    const evalPreamble = "(\uFF9F\u0414\uFF9F) ['_'] ( (\uFF9F\u0414\uFF9F) ['_'] (";
    const decodePreamble = "( (\uFF9F\u0414\uFF9F) ['_'] (";
    const evalPostamble = ") (\uFF9F\u0398\uFF9F)) ('_');";
    const decodePostamble = ") ());";

    text = String(text).trim();
    if (!text) return "";

    if (text.indexOf(evalPreamble) < 0 || !text.endsWith(evalPostamble)) {
      throw new Error("Given code is not encoded as aaencode.");
    }

    const decodingScript = text
      .replace(evalPreamble, decodePreamble)
      .replace(evalPostamble, decodePostamble);

    return eval(decodingScript);
  }
};
