const KILL_TIME = 2000;
const killer = setTimeout(() => {
  self.postMessage({ error: "Worker timeout" });
  self.close();
}, KILL_TIME);

let used = [];

self.addEventListener("message", function(e) {
  let source = e.data;
  let changed = false;
  used = [];
  
  const mark = (name) => {
    if (!used.includes(name)) used.push(name);
    changed = true;
  };
  
  try {
    
    // eval encode
    try {
      const _eval = self.eval;
      self.eval = s => source = s;
      _eval(source);
      self.eval = _eval;
      mark("evalencode");
    } catch {}
    
    // number encode
    try {
      const patt = /_\d{4}\((_\d{4})\);\}/;
      if (patt.test(source)) {
        let s = source
          .replace(/var\s/g, 'this.')
          .replace(/function\s(_\d{4})\(/, 'this.$1=function(')
          .replace(patt, 'self.__num=$1;};');
        eval('(function(){' + s + '})();');
        source = self.__num;
        mark("numberencode");
      }
    } catch {}
    
    // array encode
    try {
      const pattsplit = /(?:[^\\])"];/;
      if (pattsplit.test(source)) {
        let last = source.match(pattsplit)[0][0];
        let [h, t] = source.split(pattsplit);
        let v = h + last + '"]';
        let name = v.match(/var\s([\w\d]+)\s?=\s?\["/)[1];
        let arr = eval(v.replace(
          new RegExp('var\\s' + name + '\\s?=\\s?\\["'),
          '["'
        ));
        source = t.replace(
          new RegExp(name + '\\[(\\d+)\\]', 'g'),
          (_, i) => JSON.stringify(arr[i])
        );
        mark("arrayencode");
      }
    } catch {}
    
    // jsfuck
    try {
      if (/\+\[\]/i.test(source)) {
        source = String(eval(source.slice(0, -2)));
        mark("jsfuck");
      }
    } catch {}
    
    // aaencode
    try {
      importScripts("../decoders/aadecode.js");
      if (
          source.includes("‎ﾟωﾟﾉ=") &&
          source.includes("/｀ｍ´）ﾉ ~┻━┻") &&
          source.includes("//*´∇｀*/ ['_'];")
        ) {
        source = AADecode.decode(source);
        mark("aaencode");
      }
    } catch {}
    
    // jjencode
    try {
      importScripts("../decoders/jjdecode.js");
      if (source.includes("$$")) {
        source = JJdecode.decode(source);
        mark("jjencode");
      }
    } catch {}
    
    // urlencode
    try {
      importScripts("../decoders/urldecode.js");
      if (Urlencoded.detect(source)) {
        source = Urlencoded.unpack(source);
        mark("urlencode");
      }
    } catch {}
    
    // obfuscatorio (obfuscator.io)
    try {
      importScripts("../decoders/obfuscatorio.js");
      const Obf = self.ObfuscatorIO || self.default;
      if (Obf && Obf.detect && Obf.detect(source)) {
        source = Obf.unpack(source);
        mark("obfuscatorio");
     }
   } catch {}

    // p.a.c.k.e.r
    try {
      importScripts("../packers/p_a_c_k_e_r.js");
      if (P_A_C_K_E_R.detect(source)) {
        source = P_A_C_K_E_R.unpack(source);
        mark("p_a_c_k_e_r");
      }
    } catch {}
    
    // javascriptobfuscator
    try {
      importScripts("../packers/javascriptobfuscator.js");
      if (JavascriptObfuscator.detect(source)) {
        source = JavascriptObfuscator.unpack(source);
        mark("javascriptobfuscator");
      }
    } catch {}
    
    // myobfuscate
    try {
      importScripts("../packers/myobfuscate.js");
      if (MyObfuscate.detect(source)) {
        source = MyObfuscate.unpack(source);
        mark("myobfuscate");
      }
    } catch {}

  } catch (err) {
    console.log("[worker error]", err);
  }
  
  clearTimeout(killer);
  
  self.postMessage({
    changed,
    code: source,
    used
  });
});
