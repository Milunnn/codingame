
class Reader {

   constructor(linesString = "") {
      this.gen = null;
      this.string = linesString;
   }

   readline() {
      if (typeof readline == "function") {
         return readline();
      }
      if (this.gen == null) {
         this.gen = this.readlineGen();
      }
      return this.gen.next().value;
   }

   * readlineGen() {
      let data = this.string;
   
      data = data.split("\n").map(x => x.trim());
      
      for (const d of data) {
         yield d;
      }
   }
}

class CGXElement {

   static primitives = [ "string", "number", "boolean", "null" ];
   // static rStr = s => /'.+?'/g.test(s);
   // static rNum = s => !/\D/g.test(s);

   static sStr = s => /'/g.test(s);
   static sNum = s => /\d/g.test(s);
   static sBool = s => /t|f/g.test(s);
   static sNull = s => /n/g.test(s);
   static sBlock = s => /\(/g.test(s);

   constructor(type, value) {

      this.type = type;
      this.value = value;
   }

   tabLeft(str, count) {
      const lines = str.split("\n");
      return lines.map(x => " ".repeat(count) + x).join("\n");
   }
   /**
    * @param {number} tabSize
    * @param {number} tabSizeIncrement
    * @returns {string}
    */
   getStringValue(tabSize = 0, tabSizeIncrement = 4) {
      // Returns the string value of the current CGXElement object, formatted according to the CGX format
      let o = null;

      if (this.type == "string") {
         o = `'${this.value}'`;
      } else if (CGXElement.primitives.includes(this.type)) {
         o = this.value;
      } else if (this.type == "block") {
         // If its a block, then the value should consist of other CGXElement objects (array of CGXElement objects)
         o = [ "(",this.value.map(x => x.getStringValue(tabSizeIncrement, tabSizeIncrement)).join(";\n"), ")" ].filter(x => x.length > 0).join("\n")
      } else {
         // Key value -- value is an object consisting of two keys: key and value (both are CGXElement objects)
         o = this.value.key.getStringValue(0, tabSizeIncrement) + "=" + (CGXElement.primitives.includes(this.value.value.type) ? this.value.value.getStringValue(0, tabSizeIncrement) : ("\n" + this.value.value.getStringValue(0, tabSizeIncrement)));
      }

      return this.tabLeft(o, tabSize);
   }

   static getInitType(c) {
      if (CGXElement.sStr(c)) {
         return "string";
      }
      if (CGXElement.sNum(c)) {
         return "number";
      }
      if (CGXElement.sBool(c)) {
         return "boolean";
      }
      if (CGXElement.sNull(c)) {
         return "null";
      }
      if (CGXElement.sBlock(c)) {
         return "block";
      }
   }
   static getBracketLevel(text, bracketType) {
      return [...text].reduce((s, e) => {
         if (!s.ctx && e == bracketType) {
            s.cnt++;
         } else if (e == "'") {
            s.ctx = !s.ctx;
         }
         return s;
      }, { ctx: false, cnt: 0 }).cnt;
   }
   static removeAllUnnecesaryCharacters(str) {
      let o = "";

      let ctx = false;
      [...str].forEach(x => {
         if (!ctx) {
            if ([ "\n", "\t", " " ].includes(x)) {
               return;
            }
         }
         if (x == "'") ctx = !ctx;
         o += x;
      });

      return o;
   }
   static init(str) {

      // Remove all line feed
      // str = str.trim().split("\n").map(x => x.trim()).join("");
      str = this.removeAllUnnecesaryCharacters(str);

      const o = {
         type: null,
         value: ""
      };

      for (let i = 0; i < str.length; i++) {
         const c = str[i];
         const isStringContext = [...str.substring(0, i + 1)].filter(x => x == "'").length % 2 == 1;
         
         if (o.type == null) {
            const t = this.getInitType(c);

            o.type = t;
            o.value = c;
            continue;
         }

         // Now I know the type
         if (!isStringContext && CGXElement.primitives.includes(o.type)) {
            // If it is just a primitive, then read till I reach ";", "=" or end
            if ([";"].includes(c)) {
               // End it here
               const val = o.type == "string" ? o.value.substring(1, o.value.length - 1) : o.value; // Remove the parentheses
               return new CGXElement(o.type, val)
            }
            if (c == "=") {
               // Must be key-value pair
               const k = new CGXElement("string", o.value.substring(1, o.value.length - 1)); // The key is also a CGXElement
               const sub = str.substring(o.value.length + 1);
               const v = CGXElement.init(sub);
               // console.log("key-val:", sub)

               return new CGXElement("key-value", {
                  key: k,
                  value: v
               });
            }
         }
         
         // Being here means that either the parsing isn't over yet (no end character reached) or it is block
         if (o.type == "block") {
            // console.log("BLOCK: ", o.value, c)
            const whole = o.value + c;
            // Not a good way of doing it, but the syntax should be valid, so there is no need to check the bracket positions
            // const numberOfOpenings = [...whole].filter(x => x == "(").length; // Aahhh, brackets can be in strings......fck
            // const numberOfClosings = [...whole].filter(x => x == ")").length; // TODO - better method (regex mybe, or check string context (new method xd))
            const numberOfOpenings = this.getBracketLevel(whole, "("); // Better
            const numberOfClosings = this.getBracketLevel(whole, ")");
            // console.log(numberOfOpenings, numberOfClosings)
            if (numberOfOpenings == numberOfClosings) {
               // This should be the point where we are on the same level as when started
               const content = whole.substring(1, whole.length - 1); // Discard the brackets (i hope)
               const items = []; // Separate items by semicolons which are only in the current block, not in the deeper blocks
               
               let level = 0;
               let last = 0;
               let isInString = false;
               [...content].forEach((e, i) => {
                  if (e == "'") {
                     isInString = !isInString;
                  }
                  if (isInString) return;

                  if (e == "(") {
                     level++;
                     return;
                  }
                  if (e == ")") {
                     level--;
                     if (i != content.length - 1) return;
                  }
                  if ((e == ";" || i == content.length - 1) && level == 0) {
                     // Everything before this (and after the last occurence) is the outer element
                     const sub = content.substring(last, (i == content.length - 1) ? (i + 1) : i);
                     items.push(sub);
                     // console.log("SUB", last, i, sub)
                     last = i + 1;
                  }
               });
               // console.log(`"${content}"`, items)

               return new CGXElement(o.type, items.map(x => CGXElement.init(x)));
            }
         }

         o.value += c;
      }

      // If at the end, there was no block wrapper element
      if (o.type == "string") {
         o.value = o.value.substring(1, o.value.length - 1);
      }

      return new CGXElement(o.type, o.value);
   }

}

const r = new Reader(`1
'asd' = 'rt' `);

const lines = [];
const N = parseInt(r.readline());
for (let i = 0; i < N; i++) {
   const cgxLine = r.readline();
   lines.push(cgxLine);
}
const text = lines.join("\n");

const data = CGXElement.init(text);
// console.error(data, data.value);

const formatted = data.getStringValue();
console.log(formatted);


// For testing in nodeJS
// const fs = require("fs");
// const path = require("path");

// fs.writeFileSync(path.resolve(__dirname, "formatted.txt"), formatted);

// console.log(formatted);
// console.log(JSON.stringify(data, null, 3));