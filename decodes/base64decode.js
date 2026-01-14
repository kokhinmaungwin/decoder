case "obfuscatorio": {
  const { ObfuscatorIO } = await import("./decoders/obfuscatorio.js");
  code = ObfuscatorIO.unpack(source);
  history.push("obfuscatorio");
  break;
}
