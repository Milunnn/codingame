const words = [];
const scores = [];

function parseAndPushScoreChars(str, value) {
   scores.push([str.split(",").map(x => x.trim()), value]);
}

parseAndPushScoreChars("e, a, i, o, n, r, t, l, s, u", 1);
parseAndPushScoreChars("d, g", 2);
parseAndPushScoreChars("b, c, m, p", 3);
parseAndPushScoreChars("f, h, v, w, y", 4);
parseAndPushScoreChars("k", 5);
parseAndPushScoreChars("j, x", 8);
parseAndPushScoreChars("q, z", 10);

const N = parseInt(readline());
for (let i = 0; i < N; i++) {
   words.push(readline());
}
const letters = readline().split("");

/**
 * @param {string} word 
 * @param {Array<string>} dict 
 */
function canBeComposed(word, dict) {
   const available = [...dict];

   for (const c of word) {
      const i = available.indexOf(c);
      if (i != -1) {
         available.splice(i, 1);
         continue;
      }
      return false;
   }

   return true;
}

function getScore(word) {
   return [...word].reduce((s, e) => s + scores.find(x => x[0].includes(e))[1], 0);
}

const sorted = words.sort((a, b) => getScore(b) - getScore(a));
const firstComposable = sorted.find(x => canBeComposed(x, letters));

console.log(firstComposable);