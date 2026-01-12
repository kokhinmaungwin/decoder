// obfuscatorio.js  (obfuscator.io v1 + v2)

export function ObfuscatorIO(source){

  // ---------- V1 (array + index function) ----------
  const fnMatch = source.match(
    /var\s+(_0x[a-f0-9]{2,6})\s*=\s*function\s*\(\w+\)\s*\{\s*return\s*(\[[\s\S]*?\])\s*\[\w+\]\s*\}/i
  );

  if(fnMatch){
    const fnName = fnMatch[1];
    const arr = eval(fnMatch[2]);

    // replace calls _0xabc(1) -> "Hello"
    source = source.replace(
      new RegExp(fnName + "\\((\\d+)\\)", "g"),
      (m,i)=> JSON.stringify(arr[i])
    );

    // remove helper function
    source = source.replace(fnMatch[0], "");
    return source.trim();
  }

  // ---------- V2 (hex style) ----------
  // _0xabc("0x1a")
  const hexCall = /_0x[a-f0-9]{2,6}\(["']0x[a-f0-9]+["']\)/i;
  if(hexCall.test(source)){
    try{
      return eval(source);
    }catch{}
  }

  throw new Error("Not matched");
}

/* ---------------- DETECTION ---------------- */

ObfuscatorIO.detect = function(source){
  return (
    // v1 pattern
    /var\s+_0x[a-f0-9]{2,6}\s*=\s*function\s*\(\w+\)\s*\{\s*return\s*\[[\s\S]*?\]\s*\[\w+\]/i.test(source)
    ||
    // v2 hex pattern
    /_0x[a-f0-9]{2,6}\(["']0x[a-f0-9]+["']\)/i.test(source)
  );
};

ObfuscatorIO.unpack = function(source){
  return ObfuscatorIO(source);
};

// for worker.js importScripts
if(typeof self !== "undefined"){
  self.ObfuscatorIO = ObfuscatorIO;
}
