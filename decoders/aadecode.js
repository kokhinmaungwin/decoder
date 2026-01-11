/* AA Decode */
export const AADecode = {
    decode: function (text) {
        const evalPreamble = "(\uFF9F\u0414\uFF9F) ['_'] ( (\uFF9F\u0414\uFF9F) ['_'] (";
        const decodePreamble = "( (\uFF9F\u0414\uFF9F) ['_'] (";
        const evalPostamble = ") (\uFF9F\u0398\uFF9F)) ('_');";
        const decodePostamble = ") ());";
        // strip beginning/ending space.
        text = text.replace(/^\s*/, "").replace(/\s*$/, "");
        // returns empty text for empty input.
        if (/^\s*$/.test(text)) {
            return "";
        }
        // check if it is encoded.
        if (text.lastIndexOf(evalPreamble) < 0) {
            throw new Error("Given code is not encoded as aaencode.");
        }
        if (text.lastIndexOf(evalPostamble) != text.length - evalPostamble.length) {
            throw new Error("Given code is not encoded as aaencode.");
        }
        const decodingScript = text.replace(evalPreamble, decodePreamble)
            .replace(evalPostamble, decodePostamble);
        return eval(decodingScript);
    },
    doDecode: function () {
        const oEncoded = document.getElementById("aadecode_encoded");
        const oDecoded = document.getElementById("aadecode_decoded");
        try {
            oDecoded.value = AADecode.decode(oEncoded.value);
        } catch (ex) {
            oDecoded.value = "****Error:\n" + ex.toString();
        }
    },
    dummy: null
};
