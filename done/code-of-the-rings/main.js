
const magicPhrase = readline();

const alphabet = [...Array(26)].map((x, i) => String.fromCharCode(65 + i)).concat([" "]);
// let cur = alphabet.length - 1;
let pos = 0;
let curr = [...Array(30)].map(x => alphabet.length - 1);

function moveTo(cur, char) {
    const loc = alphabet.indexOf(char);

    const moves = [
        () => loc - cur,
        () => loc - (alphabet.length + cur),
        () => (loc + alphabet.length) - cur
    ];
    const best = moves.map(x => x()).sort((a, b) => Math.abs(a) - Math.abs(b))[0];
// console.error(cur, char, loc, best);
    // cur = loc;
    // return compileMove(best);
    return best;
}

function compileMove(move, value, writeChar = true) {
    let o = "";

    const moveChar = move < 0 ? "<" : ">";

    o += moveChar.repeat(Math.abs(move));

    if (value == 0) {
        return o + (writeChar ? "." : "");
    }

    const char = value < 0 ? "-" : "+";
    return o + char.repeat(Math.abs(value)) + (writeChar ? "." : "");
}

// const o = [...magicPhrase].map(x => {
//     const best = curr.map((xx, i) => [ i, moveTo(xx, x), Math.abs(moveTo(xx, x)) + Math.abs(pos - i) ]).sort((a, b) => a[2] - b[2])[0];
//     const bestPos = best[0];
//     const moveToo = best[1];

//     const compiled = compileMove(pos - bestPos, moveToo);

//     pos = bestPos;
//     curr[pos] = alphabet.indexOf(x);

//     return compiled;

//     // const best = predictBest(x);

//     // pos = best.pos;
//     // curr = best.curr;

//     // return best.compiled;
// }).join("");

let o = [];
for (let i = 0; i < magicPhrase.length; i++) {
   const x = magicPhrase[i];
   const best = curr.map((xx, ii) => {
      const comparer = magicPhrase.substring(i).indexOf(xx) !== -1 ? Infinity : (Math.abs(moveTo(xx, x)) + Math.abs(pos - ii))
      return [ ii, moveTo(xx, x), comparer ];
   }).sort((a, b) => a[2] - b[2])[0];

   const bestPos = best[0];
   const moveToo = best[1];

   const compiled = compileMove(pos - bestPos, moveToo);

   pos = bestPos;
   curr[pos] = alphabet.indexOf(x);

   o.push(compiled);
}
o = o.join("");

console.log(o);
