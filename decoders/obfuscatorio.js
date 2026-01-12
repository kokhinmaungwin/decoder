export function ObfuscatorIO(source){

  // ---------- V1 ----------
  const fnMatch = source.match(
    /var\s+(_0x[a-f0-9]{2,6})\s*=\s*function\s*\(\w+\)\s*\{\s*return\s*(\[[\s\S]*?\])\s*\[\w+\]\s*\}/i
  );

  if(fnMatch){
    const fnName = fnMatch[1];
    const arr = eval(fnMatch[2]);

    source = source.replace(
      new RegExp(fnName + "\\((\\d+)\\)", "g"),
      (m,i)=> JSON.stringify(arr[i])
    );

    source = source.replace(fnMatch[0], "");
    return source.trim();
  }

  // ---------- V2 ----------
  const hexCall = /_0x[a-f0-9]{2,6}\(["']0x[a-f0-9]+["']\)/i;
  if(hexCall.test(source)){
    try{
      return eval(source);
    }catch{}
  }

  // ❗ VERY IMPORTANT
  return source;   // <-- never throw here
}

ObfuscatorIO.detect = function(source){
  return (
    /var\s+_0x[a-f0-9]{2,6}\s*=\s*function\s*\(\w+\)\s*\{\s*return\s*\[[\s\S]*?\]\s*\[\w+\]/i.test(source)
    ||
    /_0x[a-f0-9]{2,6}\(["']0x[a-f0-9]+["']\)/i.test(source)
  );
};

ObfuscatorIO.unpack = function(source){
  return ObfuscatorIO(source);
};

if(typeof self !== "undefined"){
  self.ObfuscatorIO = ObfuscatorIO;
}
