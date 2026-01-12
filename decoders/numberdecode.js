/* Number Decode (safe) */
export function decodeNumberDeep(code, maxLoop = 50) {
  let loop = 0;
  let changed = true;

  while (changed && loop++ < maxLoop) {
    changed = false;

    // hex → decimal
    code = code.replace(/\b0x[0-9a-fA-F]+\b/g, m => {
      changed = true;
      return String(parseInt(m, 16));
    });

    // +true / +false
    code = code.replace(/\+true/g, () => {
      changed = true;
      return "1";
    });
    code = code.replace(/\+false/g, () => {
      changed = true;
      return "0";
    });

    // JSFuck numbers
    code = code.replace(/!\+\[\]/g, () => {
      changed = true;
      return "1";
    });
    code = code.replace(/\+\[\]/g, () => {
      changed = true;
      return "0";
    });

    // math expressions
    code = code.replace(
      /\b\d+\s*(?:[+\-*/%|&^]|<<|>>)\s*\d+\b/g,
      expr => {
        try {
          const v = Function("return " + expr)();
          if (Number.isFinite(v)) {
            changed = true;
            return String(v);
          }
        } catch {}
        return expr;
      }
    );
  }

  return code;
}
