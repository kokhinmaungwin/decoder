/* Number Decode */
export function decodeNumberDeep(source) {
  const detectPattern = /(_\d{4})\((_\d{4})\);\}/;
  if (!detectPattern.test(source)) throw new Error('Not matched pattern');

  let code = source;

  code = code.replace(/function\s(_\d{4})\(/, 'this.$1=function(');
  code = code.replace(detectPattern, 'globalThis.underscoreNumberSource=$1;};');

  const fn = new Function(`"use strict"; return (function(){ ${code} })();`);
  fn();

  return globalThis.underscoreNumberSource;
}
