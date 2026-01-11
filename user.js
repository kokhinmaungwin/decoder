/* user.js */
export async function decodeByType(input, type) {
  console.log("[decodeByType] type =", type);

  let code = input;
  let history = [];

  try {
    switch (String(type).trim()) {

      case "base64": {
        const { decodeBase64Deep } = await import("./decoders/base64decode.js");
        code = decodeBase64Deep(code);
        history.push("base64");
        break;
      }

      case "hex": {
        const { decodeHexDeep } = await import("./decoders/hexdecode.js");
        code = decodeHexDeep(code);
        history.push("hex");
        break;
      }

      case "array": {
        const { ArrayDecode } = await import("./decoders/arraydecode.js");
        code = ArrayDecode(code);
        history.push("array");
        break;
      }

      case "jj": {
        const { JJDecode } = await import("./decoders/jjdecode.js");
        code = await JJDecode(code);
        history.push("jj");
        break;
      }

      case "jsfuck": {
        const { JSFuckDecode } = await import("./decoders/jsfuckdecode.js");
        code = JSFuckDecode(code);
        history.push("jsfuck");
        break;
      }

      case "url": {
        const { Urlencoded } = await import("./decoders/urldecode.js");
        if (Urlencoded.detect(code)) {
          code = Urlencoded.unpack(code);
          history.push("url");
        }
        break;
      }

      case "number": {
        const { NumberDecode } = await import("./decoders/numberdecode.js");
        code = NumberDecode(code);
        history.push("number");
        break;
      }

      case "aa": {
        const { AADecode } = await import("./decoders/aadecode.js");
        code = AADecode.decode(code);
        history.push("aa");
        break;
      }
      
      case "obfuscatorio": {
        const { ObfuscatorIO } = await import("./decoders/obfuscatorio.js");
        code = ObfuscatorIO(source);
        history.push("obfuscatorio");
        break;
      }
      
      case "javascriptobfuscator": {
        const { JavaScriptObfuscator } = await import("./packers/javascriptobfuscator.js");
        code = JavaScriptObfuscator(source);
        history.push("javascriptobfuscator");
        break;
      }
      
      case "myobfuscate": {
        const { MyObfuscate } = await import("./packers/myobfuscate.js");
        code = MyObfuscate(source);
        history.push("myobfuscate");
        break;
      }
      
      case "p_a_c_k_e_r": {
        const { P_A_C_K_E_R } = await import("./packers/p_a_c_k_e_r.js");
        code = P_A_C_K_E_R(source);
        history.push("p_a_c_k_e_r");
        break;
      }
      default:
        throw new Error("Unsupported decode type: " + type);
    }

  } catch (err) {
    throw err;
  }

  return {
    code,
    history
  };
}
