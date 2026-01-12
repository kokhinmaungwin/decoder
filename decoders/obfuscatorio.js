// obfuscatorio.js
export function ObfuscatorIO(source){

  const fnMatch = source.match(
    /var\s+(_0x[a-f0-9]{2,6})\s*=\s*function\s*\(\w+\)\s*\{\s*return\s*(\[[\s\S]*?\])\s*\[\w+\]\s*\}/i
  );

  if(fnMatch){
    const fnName = fnMatch[1];
    const arr = eval(fnMatch[2]);

    // replace ALL calls _0xabc(0), _0xabc(1) …
    source = source.replace(
      new RegExp(fnName + "\\((\\d+)\\)", "g"),
      (m,i)=> JSON.stringify(arr[i])
    );

    // remove helper function
    source = source.replace(fnMatch[0], "");

    // cleanup: alert("x") instead of "alert"("x")
    source = source.replace(/["']alert["']\s*\(/g, "alert(");

    return source.trim();
  }

  const hexCall = /_0x[a-f0-9]{2,6}\(["']0x[a-f0-9]+["']\)/i;
  if(hexCall.test(source)){
    try{
      return eval(source);
    }catch{}
  }

  return source;
}

// Detect obfuscatorio patterns (V1 or V2)
ObfuscatorIO.detect = function(source){
  return (
    /var\s+_0x[a-f0-9]{2,6}\s*=\s*function\s*\(\w+\)\s*\{\s*return\s*\[[\s\S]*?\]\s*\[\w+\]/i.test(source)
    ||
    /_0x[a-f0-9]{2,6}\(["']0x[a-f0-9]+["']\)/i.test(source)
  );
};

// Unpack interface
ObfuscatorIO.unpack = function(source){
  return ObfuscatorIO(source);
};

// For WebWorker scope
if(typeof self !== "undefined"){
  self.ObfuscatorIO = ObfuscatorIO;
}
