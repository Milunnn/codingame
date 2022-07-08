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



const rd = new Reader(`120 176
W 4090 B 100 W 20 B 100 W 20 B 100 W 20 B 100 W 1040 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 58 B 100 W 20 B 100 W 20 B 100 W 20 B 100 W 80 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 58 B 100 W 20 B 100 W 20 B 100 W 20 B 100 W 66 B 10 W 4 B 2 W 103 B 12 W 3 B 2 W 101 B 16 W 1 B 2 W 101 B 16 W 1 B 2 W 100 B 20 W 99 B 21 W 99 B 21 W 98 B 22 W 98 B 22 W 98 B 22 W 98 B 22 W 98 B 22 W 98 B 22 W 98 B 22 W 99 B 20 W 100 B 20 W 101 B 18 W 103 B 16 W 104 B 16 W 106 B 12 W 63 B 100 W 20 B 100 W 20 B 100 W 20 B 100 W 2420 B 100 W 20 B 100 W 20 B 100 W 20 B 100 W 5050`);
// const rd = new Reader(`10 10
// W 10 B 10 W 10 B 20 W 20 B 10 W 10 B 10`);

var inputs = rd.readline().split(' ');
const w = parseInt(inputs[0]);
const h = parseInt(inputs[1]);
const IMAGE = rd.readline().split(" ");

// Parse image
const img = []; // Two-dimensional array
for (let i = 0; i < IMAGE.length; i += 2) {
   const color = IMAGE[i];
   const cnt = IMAGE[i + 1];

   const imgLength = img.reduce((s, e) => s + e.length, 0);
   for (let ci = 0; ci < cnt; ci++) {
      // Fill the color into the data
      const y = ~~((imgLength + ci) / w)
      const x = (imgLength + ci) % w;

      if (img.length <= y) {
         img.push(...[ ...Array(y - img.length + 1) ].map(x => []));
      }

      img[y].push(color);
   }
}

// Search left-top-down-right to find the black lines
let foundData = null;
for (let x = 0; x < w && !foundData; x++) { //found.length < 5
   for (let y = 0; y < h && !foundData; y++) {
      const color = img[y][x];
      if (color == "W") {
         continue;
      }
      // Scan the column
      foundData = img.map((c, i) => [ i, c[x] ]).filter(c => c[1] == "B");
   }
}

// const averageGap = (foundData[foundData.length - 1][0] - foundData[0][0]) / 5; // find the biggest gap
// const biggestGap = foundData.reduce((s, e) => {
//    if (s.last == -1) {
//       s = {
//          last: e[0],
//          gap: 0
//       }
//    } else if (s.gap < e[0] - s.last) {
//       s = {
//          last: e[0],
//          gap: e[0] - s.last
//       };
//    }
//    return s;
// }, { last: -1, gap: 0 });

// const lines = foundData.reduce((s, e, i, arr) => {
//    const ei = e[0];
//    if (s.length == 0) {
//       s.push(ei)
//    } else if (ei - s[s.length - 1] > biggestGap) {
//       s.push(ei);
//    }
//    return s;
// }, []);

const lines = foundData.reduce((s, e, ind, arr) => {
   const i = e[0];
   if (s.seq.length == 0) {
      s.seq.push(i);
   } else {
      if (i == s.seq[s.seq.length - 1] + 1 && ind != arr.length - 1) { // Check if it is in sequence (thick lines detection)
         s.seq.push(i)
      } else {
         s.data.push(s.seq[0]);
         s.seq = [ i ];
      }
   }
   return s;
}, { seq: [], data: [] });

console.log(foundData, averageGap, biggestGap, lines, l);