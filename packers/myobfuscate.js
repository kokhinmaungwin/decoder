/* myobfuscate.js */
export function MyObfuscate(source){
  const ctx = {};
  const f = new Function("ctx", `
    with(ctx){
      ${source}
      return "";
    }
  `);
  try{ f(ctx); }catch{}

  source = source.replace(/_0x[a-f0-9]{3,6}\((0x[a-f0-9]+)\)/gi, x => eval(x));
  return source;
}
