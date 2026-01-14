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
  - Obfuscatorio (`no support`)
  - MyObfuscate (`no support`)
  - JavascriptObfuscator (`no support`)
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
  - Decode JavaScript code obfuscated by Obfuscatorio.(`source map`)
- myObfuscateDecode(source)
  - Decode JavaScript obfuscated by MyObfuscate.(`source map`)
- JavascriptObfuscatorDecode(source)
  - Decode JavaScript obfuscated by JavascriptObfuscator.(`source map`)
- packerDecode(source)
  - Decode code packed with Dean Edward's Packer.

---

## 🧪 Working Examples

- 1️⃣ Base64
  - Input
```Js
var s = atob("aHR0cHM6Ly93d3cuZXhhbXBsZS5jb20=");
```
  - Output
`var s = "https://www.example.com";`

- 2️⃣ Hex & Unicode Escape
  - Input
```Js
"\x48\x65\x6c\x6c\x6f\u0020World"
```
  - Output
`"Hello World"`

- 3️⃣ Array Obfuscation
  - Input
```Js
var _0xabc = ["Hello", " ", "World"];
console.log(_0xabc[0] + _0xabc[1] + _0xabc[2]);
```
  - Output
`console.log("Hello" + " " + "World");`

- 4️⃣ MyObfuscate
  - Input
```Js
var _0xabc = function(_0x1) {
  return ['alert','Hello world!'][_0x1];
};
alert(_0xabc(1));
```
  - Output
`alert("Hello world!");`

- 5️⃣ JSFuck (no eval)
  - Input
```Js
(![]+[])[+!+[]]+(![]+[])[!+[]+!+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]+(!![]+[])[+[]]+([][(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[+!+[]+[+!+[]]]+[+!+[]]+([]+[]+[][(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[!+[]+!+[]]]
```
  - Output
`alert(1)`

- 6️⃣ JJEncode
  - Input
```Js
$=~[];$={___:++$,$$$$:(![]+"")[$],__$:++$,$_$_:(![]+"")[$],_$_:++$,$_$$:({}+"")[$],$$_$:($[$]+"")[$],_$$:++$,$$$_:(!""+"")[$],$__:++$,$_$:++$,$$__:({}+"")[$],$$_:++$,$$$:++$,$___:++$,$__$:++$};$.$_=($.$_=$+"")[$.$_$]+($._$=$.$_[$.__$])+($.$$=($.$+"")[$.__$])+((!$)+"")[$._$$]+($.__=$.$_[$.$$_])+($.$=(!""+"")[$.__$])+($._=(!""+"")[$._$_])+$.$_[$.$_$]+$.__+$._$+$.$;$.$$=$.$+(!""+"")[$._$$]+$.__+$._+$.$+$.$$;$.$=($.___)[$.$_][$.$_];$.$($.$($.$$+"\""+$.$_$_+(![]+"")[$._$_]+$.$$$_+"\\"+$.__$+$.$$_+$._$_+$.__+"(\\\"\\"+$.__$+$.__$+$.___+$.$$$_+(![]+"")[$._$_]+(![]+"")[$._$_]+$._$+"\\\")"+"\"")())();
```
  - Output
`alert("Hello")`

- 7️⃣ AAEncode
  - Input
```Js
ﾟωﾟﾉ= /｀ｍ´）ﾉ ~┻━┻   //*´∇｀*/ ['_']; o=(ﾟｰﾟ)  =_=3; c=(ﾟΘﾟ) =(ﾟｰﾟ)-(ﾟｰﾟ); (ﾟДﾟ) =(ﾟΘﾟ)= (o^_^o)/ (o^_^o);(ﾟДﾟ)={ﾟΘﾟ: '_' ,ﾟωﾟﾉ : ((ﾟωﾟﾉ==3) +'_') [ﾟΘﾟ] ,ﾟｰﾟﾉ :(ﾟωﾟﾉ+ '_')[o^_^o -(ﾟΘﾟ)] ,ﾟДﾟﾉ:((ﾟｰﾟ==3) +'_')[ﾟｰﾟ] }; (ﾟДﾟ) [ﾟΘﾟ] =((ﾟωﾟﾉ==3) +'_') [c^_^o];(ﾟДﾟ) ['c'] = ((ﾟДﾟ)+'_') [ (ﾟｰﾟ)+(ﾟｰﾟ)-(ﾟΘﾟ) ];(ﾟДﾟ) ['o'] = ((ﾟДﾟ)+'_') [ﾟΘﾟ];(ﾟoﾟ)=(ﾟДﾟ) ['c']+(ﾟДﾟ) ['o']+(ﾟωﾟﾉ +'_')[ﾟΘﾟ]+ ((ﾟωﾟﾉ==3) +'_') [ﾟｰﾟ] + ((ﾟДﾟ) +'_') [(ﾟｰﾟ)+(ﾟｰﾟ)]+ ((ﾟｰﾟ==3) +'_') [ﾟΘﾟ]+((ﾟｰﾟ==3) +'_') [(ﾟｰﾟ) - (ﾟΘﾟ)]+(ﾟДﾟ) ['c']+((ﾟДﾟ)+'_') [(ﾟｰﾟ)+(ﾟｰﾟ)]+ (ﾟДﾟ) ['o']+((ﾟｰﾟ==3) +'_') [ﾟΘﾟ];(ﾟДﾟ) ['_'] =(o^_^o) [ﾟoﾟ] [ﾟoﾟ];(ﾟεﾟ)=((ﾟｰﾟ==3) +'_') [ﾟΘﾟ]+ (ﾟДﾟ) .ﾟДﾟﾉ+((ﾟДﾟ)+'_') [(ﾟｰﾟ) + (ﾟｰﾟ)]+((ﾟｰﾟ==3) +'_') [o^_^o -ﾟΘﾟ]+((ﾟｰﾟ==3) +'_') [ﾟΘﾟ]+ (ﾟωﾟﾉ +'_') [ﾟΘﾟ]; (ﾟｰﾟ)+=(ﾟΘﾟ); (ﾟДﾟ)[ﾟεﾟ]='\\'; (ﾟДﾟ).ﾟΘﾟﾉ=(ﾟДﾟ+ ﾟｰﾟ)[o^_^o -(ﾟΘﾟ)];(oﾟｰﾟo)=(ﾟωﾟﾉ +'_')[c^_^o];(ﾟДﾟ) [ﾟoﾟ]='\"';(ﾟДﾟ) ['_'] ( (ﾟДﾟ) ['_'] (ﾟεﾟ+(ﾟДﾟ)[ﾟoﾟ]+ (ﾟДﾟ)[ﾟεﾟ]+(ﾟΘﾟ)+ (ﾟｰﾟ)+ (ﾟΘﾟ)+ (ﾟДﾟ)[ﾟεﾟ]+(ﾟΘﾟ)+ ((ﾟｰﾟ) + (ﾟΘﾟ))+ (ﾟｰﾟ)+ (ﾟДﾟ)[ﾟεﾟ]+(ﾟΘﾟ)+ (ﾟｰﾟ)+ ((ﾟｰﾟ) + (ﾟΘﾟ))+ (ﾟДﾟ)[ﾟεﾟ]+(ﾟΘﾟ)+ ((o^_^o) +(o^_^o))+ ((o^_^o) - (ﾟΘﾟ))+ (ﾟДﾟ)[ﾟεﾟ]+(ﾟΘﾟ)+ ((o^_^o) +(o^_^o))+ (ﾟｰﾟ)+ (ﾟДﾟ)[ﾟεﾟ]+((ﾟｰﾟ) + (ﾟΘﾟ))+ (c^_^o)+ (ﾟДﾟ)[ﾟεﾟ]+(ﾟｰﾟ)+ ((o^_^o) - (ﾟΘﾟ))+ (ﾟДﾟ)[ﾟεﾟ]+(ﾟΘﾟ)+ (ﾟΘﾟ)+ (c^_^o)+ (ﾟДﾟ)[ﾟεﾟ]+(ﾟΘﾟ)+ (ﾟｰﾟ)+ ((ﾟｰﾟ) + (ﾟΘﾟ))+ (ﾟДﾟ)[ﾟεﾟ]+(ﾟΘﾟ)+ ((ﾟｰﾟ) + (ﾟΘﾟ))+ (ﾟｰﾟ)+ (ﾟДﾟ)[ﾟεﾟ]+(ﾟΘﾟ)+ ((ﾟｰﾟ) + (ﾟΘﾟ))+ (ﾟｰﾟ)+ (ﾟДﾟ)[ﾟεﾟ]+(ﾟΘﾟ)+ ((ﾟｰﾟ) + (ﾟΘﾟ))+ ((ﾟｰﾟ) + (o^_^o))+ (ﾟДﾟ)[ﾟεﾟ]+(ﾟｰﾟ)+ ((o^_^o) - (ﾟΘﾟ))+ (ﾟДﾟ)[ﾟεﾟ]+((ﾟｰﾟ) + (ﾟΘﾟ))+ (ﾟΘﾟ)+ (ﾟДﾟ)[ﾟoﾟ]) (ﾟΘﾟ)) ('_');
```
  - Output
`alert("Hello")`

- 8️⃣ JavascriptObfuscator
  - Input
```Js
var _0x12ab = ['log', 'Hello JSObfuscator'];
(function(_0x5a9d, _0x12ab) {
  var _0x3f12 = function(_0x4fcd) {
    return _0x12ab[_0x4fcd];
  };
  console[_0x3f12(0)](_0x3f12(1));
})(0, _0x12ab);
```
  - Output
`console["log"]("Hello JSObfuscator");`

- 9️⃣ Packer
  - Input
```Js
eval(function(p,a,c,k,e,d){
e=function(c){return c.toString(36)};
if(!''.replace(/^/,String)){
while(c--)d[c.toString(a)]=k[c]||c.toString(a);
k=[function(e){return d[e]}];
e=function(){return'\\w+'};
c=1;
}
while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);
return p;
}('0("1 2!")',3,3,'alert|Hello|Packer'.split('|'),0,{}))
```
  - Output
`alert("Hello Packer!");`
- 🔟 Mixed (Real World)
  - Input
```Js
var _0x=["\x48\x69"];
alert(_0x[0]);
```
  - Output
`alert("Hi");`

---

## Contributing

Feel free to open issues or submit pull requests to improve support for additional encodings or obfuscation techniques.

---

## Notes
- Some decoding methods may rely on eval internally, which can be dangerous. Use caution and only decode trusted input.
- Not all encoded or obfuscated code can be perfectly decoded, especially if the encoding uses custom or uncommon patterns.

---

# Decoder Project

## About

This project aims to decode JavaScript code obfuscated with Obfuscatorio and similar tools.

---

## Important Notice: Source Map Requirement

### ⚠️ Source Map is Essential for Full Decoding

Due to advanced obfuscation techniques such as:

- Virtual Machine-based obfuscation
- Control flow flattening
- Property renaming and mangling

it is **impossible** to fully decode the obfuscated JavaScript without the corresponding **source map** file.

### What if You Don't Have a Source Map?

- Decoding will only be **partial** and many parts of the code will remain unreadable.
- Some obfuscation methods cannot be reversed without the original source map.
- If you want to fully recover the original code, **please ensure the source map file is available**.

---

## Usage

```bash
node decode.js 
node decode.js
path/to/obfuscated.js
path/to/obfuscated.js.map
```
Make sure the .map file corresponds exactly to the obfuscated JavaScript file.

---

## Summary
|--------------------|------------------------|
| Situation          | Decoding Result        |
| Source Map Present | 100% Decoding Possible |
| Source Map Missing | Partial Decoding Only  |
| VM Obfuscation Used| Decoding Impossible    |

---

## Contribution
- If you want to improve decoding without source maps, pull requests are welcome!
- Thank you for using the decoder project.

---

## License

MIT License

---

## Author

Created and maintained by [Khin Maung Win]

---
