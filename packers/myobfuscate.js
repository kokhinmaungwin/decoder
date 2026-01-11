export const MyObfuscate = {

  detect(code) {
    return /\bvar\s+\w+\s*=\s*function\s*\(\w+\)\s*\{\s*return\s*\[/.test(code);
  },

  unpack(code) {
    // 1) extract lookup function
    const fnMatch = code.match(
      /var\s+(\w+)\s*=\s*function\s*\(\w+\)\s*\{\s*return\s*(\[[^\]]+\])\s*\[\w+\]\s*;\s*\};/
    );

    if (!fnMatch) return code;

    const fnName = fnMatch[1];
    const array = eval(fnMatch[2]); // SAFE: only literal array

    // 2) replace calls _my(0) → "alert"
    code = code.replace(
      new RegExp(fnName + "\\((\\d+)\\)", "g"),
      (_, i) => JSON.stringify(array[Number(i)])
    );

    // 3) remove helper function
    code = code.replace(fnMatch[0], "");

    return code;
  }
};
