export const JavascriptObfuscator = {

  detect(source) {
    return /var\s+_0x[a-f0-9]+\s*=\s*\[/.test(source) &&
           /_0x[a-f0-9]+\(\d+\)/.test(source);
  },

  unpack(source) {
    // extract string array
    const arrMatch = source.match(/var\s+(_0x[a-f0-9]+)\s*=\s*(\[[^\]]+\])/);
    if (!arrMatch) return source;

    const arrName = arrMatch[1];
    const arr = eval(arrMatch[2]);   // ['log','Hello JSObfuscator']

    // find mapper function
    const fnMatch = source.match(
      new RegExp("var\\s+(_0x[a-f0-9]+)\\s*=\\s*function\\(\\w+\\)\\s*\\{\\s*return\\s+" + arrName + "\\[\\w+\\];\\s*\\}")
    );
    if (!fnMatch) return source;

    const fnName = fnMatch[1];

    // replace _0xXXXX(n) with actual string
    source = source.replace(
      new RegExp(fnName + "\\((\\d+)\\)", "g"),
      (_, i) => JSON.stringify(arr[Number(i)])
    );

    return source;
  }
};
