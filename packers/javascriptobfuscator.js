export const JavascriptObfuscator = {

  detect(source) {
    return /var\s+_0x[a-f0-9]+\s*=\s*\[/.test(source) &&
           /_0x[a-f0-9]+\(\d+\)/.test(source);
  },

  unpack(source) {
    // 1) extract string array
    const arrMatch = source.match(/var\s+(_0x[a-f0-9]+)\s*=\s*(\[[^\]]+\])/);
    if (!arrMatch) return source;

    const arrName = arrMatch[1];
    const arr = eval(arrMatch[2]);

    // 2) find mapper
    const fnMatch = source.match(
      new RegExp(
        "var\\s+(_0x[a-f0-9]+)\\s*=\\s*function\\(\\w+\\)\\s*\\{\\s*return\\s+" +
        arrName + "\\[\\w+\\];\\s*\\}"
      )
    );
    if (!fnMatch) return source;

    const fnName = fnMatch[1];

    // 3) replace calls
    source = source.replace(
      new RegExp(fnName + "\\((\\d+)\\)", "g"),
      (_, i) => JSON.stringify(arr[Number(i)])
    );

    // 4) remove dead code
    source = source
      // remove array
      .replace(new RegExp("var\\s+" + arrName + "\\s*=\\s*\\[[^\\]]+\\];?", "g"), "")
      // remove mapper function
      .replace(new RegExp("var\\s+" + fnName + "\\s*=\\s*function[\\s\\S]*?\\};?", "g"), "")
      // remove useless IIFE wrapper
      .replace(/\(function\s*\([^)]*\)\s*\{([\s\S]*?)\}\)\([^)]*\);?/g, "$1");

    return source.trim();
  }
};
