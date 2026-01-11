export const JavascriptObfuscator = {
  detect(source) {
    return /_0x[a-f0-9]{4,6}/i.test(source);
  },

  unpack(source) {
    const sandbox = {};
    const fn = new Function("sandbox", `
      with(sandbox){
        ${source}
        return typeof _0x !== "undefined" ? _0x : null;
      }
    `);
    try { fn(sandbox); } catch {}

    return source.replace(/_0x[a-f0-9]{4,6}\((0x[a-f0-9]+)\)/gi, m => eval(m));
  }
};
