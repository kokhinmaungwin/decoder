// obfuscatorio.js  (obfuscator.io v1 + v2)

export function ObfuscatorIO(source){

  // --- V1 (array + index function) ---
  const fnMatch = source.match(/var\s+(_0x[a-f0-9]{2,6})\s*=\s*function\s*\(\w+\)\s*\{\s*return\s*(\[[\s\S]*?\])\s*\[\w+\]\s*\}/i);

  if(fnMatch){
    const fnName = fnMatch[1];
    const arr = eval(fnMatch[2]);

    source = source.replace(new RegExp(fnName + "\\((\\d+)\\)", "g"), (m,i)=>{
      return JSON.stringify(arr[i]);
    });

    // remove helper function
    source = source.replace(fnMatch[0], "");
    return source;
  }

  // --- V2 (hex call style) ---
  const hexCall = /(_0x[a-f0-9]{2,6})\(["']0x[a-f0-9]+["']\)/i;
  if(hexCall.test(source)){
    try{
      return eval(source);
    }catch{}
  }

  throw new Error("Not matched");
}

// --- API for your system ---
ObfuscatorIO.detect = function(source){
  return /var\s+_0x[a-f0-9]{2,6}\s*=\s*function|\["_0x|return\s*\[.*?\]\s*\[/.test(source);
};

ObfuscatorIO.unpack = function(source){
  return ObfuscatorIO(source);
};

if(typeof self !== "undefined"){
  self.ObfuscatorIO = ObfuscatorIO;
}
