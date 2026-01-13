# Decoder

**Decoder** is a powerful, flexible JavaScript library designed to decode various common encoding and obfuscation methods frequently used to hide or protect code and data. This toolkit supports decoding multiple formats including Base64, Hex, Unicode escapes, URL encoding, Number arrays, and popular JavaScript obfuscation patterns such as AAencode, JJencode, JSFuck, Obfuscatorio, MyObfuscate, JavascriptObfuscator, and Packer.

---

## Features

- Decode common encodings like:
  - Base64
  - Hexadecimal & Unicode escape sequences
  - URL encoding
  - Number arrays
- Decode popular JavaScript obfuscation schemes:
  - AAencode
  - JJencode
  - JSFuck (with and without `eval`)
  - Obfuscatorio
  - MyObfuscate
  - JavascriptObfuscator
  - Packer

---

## Installation

- You can install via npm:

```bash
npm install decoder
```
Or include it directly in your project.

---

## Usage

- Import the decoder functions you want to use:
```Js
import { base64Decode, hexDecode, urlDecode, AAdecode, JJDecode, JSFuckDecode, ObfuscatorIO, myObfuscateDecode, JavascriptObfuscatorDecode, packerDecode } from 'all-decode';

// Base64 decode
const decodedBase64 = base64Decode("SGVsbG8gd29ybGQ=");

// Hex decode
const decodedHex = hexDecode("\\x48\\x65\\x6c\\x6c\\x6f");

// URL decode
const decodedUrl = urlDecode("Hello%20World");

// JSFuck decode (without eval)
const decodedJSFuck = JSFuckDecode(jsFuckCode);

// Obfuscatorio decode
const decodedObfuscatorio = ObfuscatorIO.unpack(obfuscatedCode);

// And many more...
```

---

## API

- base64Decode(encodedString)
  - Decode a Base64 encoded string.
- hexDecode(hexString)
  - Decode a Hexadecimal or Unicode escape sequence string.
- urlDecode(encodedUrl)
  - Decode a URL-encoded string.
- AAdecode(encodedAA)
  - Decode AAencoded JavaScript.
- JJDecode(encodedJJ)
  - Decode JJencoded JavaScript.
- JSFuckDecode(source)
  - Decode JSFuck obfuscated JavaScript code.
  - Note: If the input requires eval to decode, it may throw an error for security reasons.
- ObfuscatorIO.unpack(source)
  - Decode JavaScript code obfuscated by Obfuscatorio.
- myObfuscateDecode(source)
  - Decode JavaScript obfuscated by MyObfuscate.
- JavascriptObfuscatorDecode(source)
  - Decode JavaScript obfuscated by JavascriptObfuscator.
- packerDecode(source)
  - Decode code packed with Dean Edward's Packer.

---

## Contributing

Feel free to open issues or submit pull requests to improve support for additional encodings or obfuscation techniques.

---

## License

MIT License

---

## Author

Created and maintained by [Khin Maung Win]

---

## Notes
- Some decoding methods may rely on eval internally, which can be dangerous. Use caution and only decode trusted input.
- Not all encoded or obfuscated code can be perfectly decoded, especially if the encoding uses custom or uncommon patterns.
---
