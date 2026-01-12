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
      importScripts("../decoders/numberdecode.js");
      if (/\b0x[0-9a-f]+\b|!\+\[\]|\+true|\+false|<<|>>|\^|\|/.test(source)) {
        source = decodeNumberDeep(source);
        mark("numberencode");
      }
    } catch {}
    
    // array encode
    try {
      importScripts("../decoders/arraydecode.js");
      const out = ArrayDecode(source);
         if (out !== source) {
         source = out;
         mark("arrayencode");
       }
     } catch (e) {}
    
    // jsfuck
    try {
      importScripts("../decoders/jsfuckdecode.js");
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
    
    // obfuscatorio
    try {
      importScripts("../decoders/obfuscatorio.js");
      if (ObfuscatorIO.detect(source)) {
      let old;
      do {
      old = source;
        source = ObfuscatorIO.unpack(source);
      } while (source !== old);
        mark("obfuscatorio");
     }
   } catch (e) {
     console.error("obfuscatorio failed", e);
   }

   // javascriptobfuscator
   try {
     const { JavascriptObfuscator } = await import("../packers/javascriptobfuscator.js");
     if (JavascriptObfuscator.detect(source)) {
       source = JavascriptObfuscator.unpack(source);
       mark("javascriptobfuscator");
     }

   } catch (e) {
     console.error("JSObfuscator failed", e);
   }

   // myobfuscate
   try {
     const { MyObfuscate } = await import("../packers/myobfuscate.js");
     if (self.MyObfuscate && MyObfuscate.detect(source)) {
‎    source = MyObfuscate.unpack(source);
‎    mark("myobfuscate");
‎  }
‎
  ‎} catch (e) {
‎    console.error("MyObfuscate failed", e);
  ‎}
    
  // packer (Dean Edwards)
‎    try {
‎      const { P_A_C_K_E_R } = await import("../packers/p_a_c_k_e_r.js");
‎      if (P_A_C_K_E_R.detect(source)) {
‎        source = P_A_C_K_E_R.unpack(source);
‎        mark("p_a_c_k_e_r");
‎      }
‎    } catch {}

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
