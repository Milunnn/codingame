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

const mors = [
   ".-",
   "-...",
   "-.-.",
   "-..",

   ".",
   "..-.",
   "--.",
   "....",

   "..",
   ".---",
   "-.-",
   ".-..",

   "--",
   "-.",
   "---",
   ".--.",

   "--.-",
   ".-.",
   "...",
   "-",

   "..-",
   "...-",
   ".--",
   "-..-",

   "-.--",
   "--..",
];

function getMorse(word) {
    return [...word].reduce((s, e) => s + mors[e.charCodeAt() - 65], "")
}
function getMorseDict(words) {
    const o = [];
    for (const w of words) {
        o.push(getMorse(w));
    }
    return o;
}

function gen(str, start, dict, dupl) {

    if (start == str.length) {
        return 1; // If at the end, return 1 (for this 1 combination)
    }

    const key = str.substring(0, start); // Key for the duplicate db

    if (dupl[key]) { // If it is duplicate, return the number of duplicates
        return dupl[key];
    }

    let o = 0;
    for (let i = 0; i < dict.length; i++) {
        if (str.substring(start, start + dict[i].length) === dict[i]) { // Check if this words is suitable
            o += gen(str, start + dict[i].length, dict, dupl); // If it is, then check deeper for the final combinations
        }
    }
    dupl[key] = o;

    return o; // And return it
}


// Init
const rd = new Reader(`--.-------..
5
GOD
GOOD
MORNING
G
HELLO`);

const words = [];

const L = rd.readline();
const N = parseInt(rd.readline());
for (let i = 0; i < N; i++) {
   const W = rd.readline();
   words.push(W);
}

// console.error(L)
// Calls
const dupl = {};
const di = getMorseDict(words);
const g = gen(L, 0, di, dupl);

console.error(dupl)
console.log(g);