/**
 * @type {string[]}
 */
let belowSeaLevel = [];
const N = parseInt(readline());
for (let i = 0; i < N; i++) {
    const line = readline();
    if (line.includes("~")) {
        belowSeaLevel.push(line);
    }
}

const boat = belowSeaLevel.map(x => {
    const start = [...x].findIndex(y => y == "\\");
    if (start == -1) return null;
    const startSliced = x.slice(start);
    const end = [...startSliced].findIndex(y => y == "/");
    if (end == -1) return null;
    const endSliced = startSliced.slice(0, end + 1);
    return endSliced;
}).filter(x => x);

const sinkHoles = [ "o", "O", "0" ];
const holeCount = boat.reduce((s, e) => {
   const c = [...e].filter((x, i) => sinkHoles.includes(x) && e[i - 1] != "{" && e[i + 1] != "}").length;
   return s + c;
}, 0);

console.log(belowSeaLevel);
console.log(boat);
console.log(holeCount);