/* jjdecode.js */
export const JJdecode = {
  dst: '',
  out: function (c) {
    this.dst += c;
  },
  decode: function (txt) {
    this.dst = ''; // Reset output each time decode is called
    let t = txt.trim();

    let startpos, endpos, gv, gvl;

    if (t.indexOf("\"\'\\\"+\'+\",") === 0) {
      startpos = t.indexOf('$$+"\\""+') + 8;
      endpos = t.indexOf('"\\"")())()');
      gv = t.substring(t.indexOf('"\'\\"+\'+",') + 9, t.indexOf("=~[]"));
      gvl = gv.length;
    } else {
      gv = t.substr(0, t.indexOf("="));
      gvl = gv.length;
      startpos = t.indexOf('"\\""+') + 5;
      endpos = t.indexOf('"\\"")())()');
    }

    if (startpos === endpos) {
      throw new Error("No data!");
    }

    let data = t.substring(startpos, endpos);

    const b = [
      "___+", "__$+", "_$_+", "_$$+", "$__+", "$_$+", "$$_+", "$$$+",
      "$___+", "$__$+", "$_$_+", "$_$$+", "$$__+", "$$_$+", "$$$_+", "$$$$+"
    ];

    const str_l = "(![]+\"\")[" + gv + "._$_]+";
    const str_o = gv + "._$+";
    const str_t = gv + ".__+";
    const str_u = gv + "._+";
    const str_hex = gv + ".";
    const str_s = '"';
    const gvsig = gv + ".";
    const str_quote = '\\\\\\"';
    const str_slash = '\\\\\\\\';
    const str_lower = "\\\\\"+";
    const str_upper = "\\\\\"+" + gv + "._+";
    const str_end = '"+';

    while (data !== "") {
      if (data.indexOf(str_l) === 0) {
        data = data.substr(str_l.length);
        this.out("l");
        continue;
      } else if (data.indexOf(str_o) === 0) {
        data = data.substr(str_o.length);
        this.out("o");
        continue;
      } else if (data.indexOf(str_t) === 0) {
        data = data.substr(str_t.length);
        this.out("t");
        continue;
      } else if (data.indexOf(str_u) === 0) {
        data = data.substr(str_u.length);
        this.out("u");
        continue;
      }

      if (data.indexOf(str_hex) === 0) {
        data = data.substr(str_hex.length);
        for (let i = 0; i < b.length; i++) {
          if (data.indexOf(b[i]) === 0) {
            data = data.substr(b[i].length);
            this.out(i.toString(16));
            break;
          }
        }
        continue;
      }

      if (data.indexOf(str_s) === 0) {
        data = data.substr(str_s.length);
        if (data.indexOf(str_upper) === 0) {
          data = data.substr(str_upper.length);
          let ch_str = "";
          for (let j = 0; j < 2; j++) {
            if (data.indexOf(gvsig) === 0) {
              data = data.substr(gvsig.length);
              for (let k = 0; k < b.length; k++) {
                if (data.indexOf(b[k]) === 0) {
                  data = data.substr(b[k].length);
                  ch_str += k.toString(16);
                  break;
                }
              }
            } else {
              break;
            }
          }
          this.out(String.fromCharCode(parseInt(ch_str, 16)));
          continue;
        } else if (data.indexOf(str_lower) === 0) {
          data = data.substr(str_lower.length);
          let ch_str = "";
          let ch_lotux = "";
          let temp = "";
          let b_checkR1 = 0;
          for (let j = 0; j < 3; j++) {
            if (j > 1) {
              if (data.indexOf(str_l) === 0) {
                data = data.substr(str_l.length);
                ch_lotux = "l";
                break;
              } else if (data.indexOf(str_o) === 0) {
                data = data.substr(str_o.length);
                ch_lotux = "o";
                break;
              } else if (data.indexOf(str_t) === 0) {
                data = data.substr(str_t.length);
                ch_lotux = "t";
                break;
              } else if (data.indexOf(str_u) === 0) {
                data = data.substr(str_u.length);
                ch_lotux = "u";
                break;
              }
            }
            if (data.indexOf(gvsig) === 0) {
              temp = data.substr(gvsig.length);
              for (let k = 0; k < 8; k++) {
                if (temp.indexOf(b[k]) === 0) {
                  if (parseInt(ch_str + k, 8) > 128) {
                    b_checkR1 = 1;
                    break;
                  }
                  ch_str += k;
                  data = data.substr(gvsig.length);
                  data = data.substr(b[k].length);
                  break;
                }
              }
              if (b_checkR1 === 1) {
                if (data.indexOf(str_hex) === 0) {
                  data = data.substr(str_hex.length);
                  for (let i = 0; i < b.length; i++) {
                    if (data.indexOf(b[i]) === 0) {
                      data = data.substr(b[i].length);
                      ch_lotux = i.toString(16);
                      break;
                    }
                  }
                }
              }
            } else {
              break;
            }
          }
          this.out(String.fromCharCode(parseInt(ch_str, 8)) + ch_lotux);
          continue;
        } else {
          let match = 0;
          while (true) {
            const n = data.charCodeAt(0);
            if (data.indexOf(str_quote) === 0) {
              data = data.substr(str_quote.length);
              this.out('"');
              match++;
              continue;
            } else if (data.indexOf(str_slash) === 0) {
              data = data.substr(str_slash.length);
              this.out('\\');
              match++;
              continue;
            } else if (data.indexOf(str_end) === 0) {
              if (match === 0) throw new Error("+ no match S block: " + data);
              data = data.substr(str_end.length);
              break;
            } else if (data.indexOf(str_upper) === 0) {
              if (match === 0) throw new Error("no match S block n>128: " + data);
              data = data.substr(str_upper.length);
              let ch_str = "";
              let ch_lotux = "";
              for (let j = 0; j < 10; j++) {
                if (j > 1) {
                  if (data.indexOf(str_l) === 0) {
                    data = data.substr(str_l.length);
                    ch_lotux = "l";
                    break;
                  } else if (data.indexOf(str_o) === 0) {
                    data = data.substr(str_o.length);
                    ch_lotux = "o";
                    break;
                  } else if (data.indexOf(str_t) === 0) {
                    data = data.substr(str_t.length);
                    ch_lotux = "t";
                    break;
                  } else if (data.indexOf(str_u) === 0) {
                    data = data.substr(str_u.length);
                    ch_lotux = "u";
                    break;
                  }
                }
                if (data.indexOf(gvsig) === 0) {
                  data = data.substr(gvsig.length);
                  for (let k = 0; k < b.length; k++) {
                    if (data.indexOf(b[k]) === 0) {
                      data = data.substr(b[k].length);
                      ch_str += k.toString(16);
                      break;
                    }
                  }
                } else {
                  break;
                }
              }
              this.out(String.fromCharCode(parseInt(ch_str, 16)));
              break;
            } else if (data.indexOf(str_lower) === 0) {
              if (match === 0) throw new Error("no match S block n<128: " + data);
              data = data.substr(str_lower.length);
              let ch_str = "";
              let ch_lotux = "";
              let temp = "";
              let b_checkR1 = 0;
              for (let j = 0; j < 3; j++) {
                if (j > 1) {
                  if (data.indexOf(str_l) === 0) {
                    data = data.substr(str_l.length);
                    ch_lotux = "l";
                    break;
                  } else if (data.indexOf(str_o) === 0) {
                    data = data.substr(str_o.length);
                    ch_lotux = "o";
                    break;
                  } else if (data.indexOf(str_t) === 0) {
                    data = data.substr(str_t.length);
                    ch_lotux = "t";
                    break;
                  } else if (data.indexOf(str_u) === 0) {
                    data = data.substr(str_u.length);
                    ch_lotux = "u";
                    break;
                  }
                }
                if (data.indexOf(gvsig) === 0) {
                  temp = data.substr(gvsig.length);
                  for (let k = 0; k < 8; k++) {
                    if (temp.indexOf(b[k]) === 0) {
                      if (parseInt(ch_str + k, 8) > 128) {
                        b_checkR1 = 1;
                        break;
                      }
                      ch_str += k;
                      data = data.substr(gvsig.length);
                      data = data.substr(b[k].length);
                      break;
                    }
                  }
                  if (b_checkR1 === 1) {
                    if (data.indexOf(str_hex) === 0) {
                      data = data.substr(str_hex.length);
                      for (let i = 0; i < b.length; i++) {
                        if (data.indexOf(b[i]) === 0) {
                          data = data.substr(b[i].length);
                          ch_lotux = i.toString(16);
                          break;
                        }
                      }
                    }
                  }
                } else {
                  break;
                }
              }
              this.out(String.fromCharCode(parseInt(ch_str, 8)) + ch_lotux);
              break;
            } else if (
              (0x21 <= n && n <= 0x2f) ||
              (0x3A <= n && n <= 0x40) ||
              (0x5b <= n && n <= 0x60) ||
              (0x7b <= n && n <= 0x7f)
            ) {
              this.out(data.charAt(0));
              data = data.substr(1);
              match++;
            } else {
              throw new Error("no match : " + data);
            }
          }
          continue;
        }

        throw new Error("no match : " + data);
      }
    }
  }
};

export async function JJDecode(input) {
  JJdecode.dst = '';
  JJdecode.decode(input);
  return JJdecode.dst;
}
