// decoders/obfuscatorio.esm.js

export function detect(code) {
  const hasStringArray =
    /function\s+_0x[a-f0-9]{4,}\s*\([^)]*\)/i.test(code) &&
    /var\s+_0x[a-f0-9]{4,}\s*=\s*\[\s*['"]/.test(code);
  const hasHexIndex = /_0x[a-f0-9]{4,}\s*\(0x[a-f0-9]+\)/i.test(code);
  const hasRenamedProps = /['_"]_0x[a-f0-9]{4,}['_"]\s*:/.test(code);

  if ((hasStringArray && hasHexIndex) || hasRenamedProps) {
    return "obfuscatorio";
  }
  return false;
}

export function unpack(source) {
  // Your unpacking logic here.
  // For now just returning source (replace with real logic)
  return source;
}
