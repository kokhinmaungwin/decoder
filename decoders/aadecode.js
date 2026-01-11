/* aadecode.js */
globalThis.ﾟ = {};
globalThis.ω = {};
globalThis.ﾉ = function(){};

export function AADecode(text) {
  const evalPreamble = "(\uFF9F\u0414\uFF9F) ['_'] ( (\uFF9F\u0414\uFF9F) ['_'] (";
  const decodePreamble = "( (\uFF9F\u0414\uFF9F) ['_'] (";
  const evalPostamble = ") (\uFF9F\u0398\uFF9F)) ('_');";
  const decodePostamble = ") ());";

  text = text.trim();
  if (!text) return "";

  if (!text.includes(evalPreamble) || !text.endsWith(evalPostamble)) {
    throw new Error("Not AA encoded");
  }

  const decodingScript = text
    .replace(evalPreamble, decodePreamble)
    .replace(evalPostamble, decodePostamble);

  return (0, eval)(decodingScript); // force global eval
}
