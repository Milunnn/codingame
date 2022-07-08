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

function findData(data, xStart) {
   // Search left-top-down-right to find the black lines
   let foundData = null;
   let xFound = -1;
   for (let x = xStart; x < w && !foundData; x++) {
      for (let y = 0; y < h && !foundData; y++) {
         const color = data[y][x];
         if (color == "W") {
            continue;
         }
         // Scan the column
         foundData = img.map((c, i) => [ i, c[x] ]).filter(c => c[1] == "B");
         xFound = x;
      }
   }
   return {
      x: xFound,
      data: foundData
   };
}

function structurizeDataSequence(data, minLength, selector = e => e[0]) {
   const lines = [...data, -1].reduce((s, e, ind, arr) => {
      const i = selector(e);
      if (s.seq.length == 0) {
         s.seq.push(i);
      } else {
         if (ind != arr.length - 1) {
            if (i == s.seq[s.seq.length - 1] + 1) {
               s.seq.push(i)
            } else {
               s.data.push({
                  start: s.seq[0],
                  end: s.seq[s.seq.length - 1]
               });
               s.seq = [ i ]
            }
         } else {
            s.data.push({
               start: s.seq[0],
               end: s.seq[s.seq.length - 1]
            })
         }
      }
      return s;
   }, { seq: [], data: [] });

   return lines.data.filter(x => x.end - x.start >= minLength);
}

function findNotes(data) {
   // Try to search for all notes
   const verticalLines = [] // Find vertical lines, that should indicate there is a note
   const horizontalLines = [];

   let horizontalLineSpace = -1;
   let minVertLineLength = -1;

   for (let x = 0; x < w; x++) {
      const d = findData(data, x);

      if (x == 0) {
         // Set the x to the starting position
         x = d.x;
         // Also set the horizontals
         horizontalLines.push(...structurizeDataSequence(d.data, 0));
         // Get the average (floored) space between horizontal lines
         horizontalLineSpace = ~~(horizontalLines.reduce((s, e, i, arr) => {
            if (i == 0) {
               return s;
            }
            return s + ((e.end + e.start) / 2 - (arr[i - 1].end + arr[i - 1].start) / 2);
         }, 0) / (horizontalLines.length - 1));
         // Add sixth horizontal line (for Cs)
         horizontalLines.push({
            start: horizontalLines[horizontalLines.length - 1].start + horizontalLineSpace,
            end: horizontalLines[horizontalLines.length - 1].end + horizontalLineSpace
         })
         // And guess the minimal vertical line length
         minVertLineLength = ~~(horizontalLineSpace * (2 - 0.25)) // 0.25 tolerance for some inaccuracy
         // And continue next iteration :)
         continue;
      }

      if (!d.data) {
         break;
      }

      const verts = structurizeDataSequence(d.data, minVertLineLength);

      if (verts.length > 0) {
         verticalLines.push({
            x,
            y: verts[0]
         });
      }
   }

   const unique = structurizeDataSequence(verticalLines, 0, e => e.x);
   const merge = unique.map(x => ({x: x, y: verticalLines.find(y => y.x == x.start).y}));

   const noteRadius = ~~(horizontalLineSpace / 2); // The radius of the circle of the note
   const horizontalLineThickness = horizontalLines[0].end - horizontalLines[0].start;

   function verticalScan(yStart, xStart, horizLines) {
      // Create a vertical line from the center till it reaches something (black) from both ends, ignoring horizontal lines completely
      let ys = yStart;
      let ye = yStart;

      for (let i = yStart; i >= 0; i--) {
         const d = img[i][xStart];
         const isPossiblyHorizontalLine = horizLines.some(x => i >= x.start && i <= x.end);
         if (!isPossiblyHorizontalLine && (d == "B" || i == 0)) {
            ys = i;
            break;
         }
      }
      for (let i = yStart; i < h; i++) {
         const d = img[i][xStart];
         const isPossiblyHorizontalLine = horizLines.some(x => i >= x.start && i <= x.end);
         if (!isPossiblyHorizontalLine && (d == "B" || i == h - 1)) {
            ye = i;
            break;
         }
      }

      return {
         x: {
            start: xStart,
            end: xStart
         },
         y: {
            start: ys == yStart ? yStart : (ys - horizontalLineThickness),
            end: ye
         }
      }
   }

   // The index of notes to be rounded into (half-horizontal lines)
   const horizAndHalf = [ ...Array(horizontalLines.length * 2) ].map((x, i) => ~~((horizontalLines[~~(i / 2)].end + horizontalLines[~~(i / 2)].start) / 2) - (i % 2 == 0 ? ~~(horizontalLineSpace / 2) : 0));
   const noteDict = [
      "G",
      "F",
      "E",
      "D",
      "C",
      "B",
      "A",
      "G",
      "F",
      "E",
      "D",
      "C"
   ];

   const notes = merge.map(e => {
      const o = [];
      const dirs = [ "start", "end" ];

      for (const dim of dirs) {
         for (const dir of dirs) {
            const y1 = e.y[dim];
            const x1 = e.x[dir] + 1 * (dir == "start" ? (-1) : 1);

            const noteLoc = {
               x: dim == "start" ? (e.x.end + ~~(noteRadius / 1.3)) : (e.x.start - ~~(noteRadius / 1.3)),
               y: dim == "start" ? (e.y.start + ~~(noteRadius / 4)) : (e.y.end - ~~(noteRadius / 3))
            };

            const l = verticalScan(y1, x1, horizontalLines);
            o.push({
               yLoc: dim,
               xLoc: dir,
               y: e.y,
               x: e.x,
               noteLocRaw: noteLoc,
               noteGuess: noteDict[horizAndHalf.map((x, i) => [ i, Math.abs(~~(x - noteLoc.y)) ]).sort((a, b) => a[1] - b[1])[0][0]],
               noteColor: img[noteLoc.y][noteLoc.x],
               length: l.y.end - l.y.start
            });
         }
      }
      
      return o.sort((a, b) => a.length - b.length)[0];
   });

   const final = notes.map(x => `${x.noteGuess}${x.noteColor == "B" ? "Q" : "H"}`).join(" ");

   return final;
}

// Custom made Reader for codinGame, for doing tests in vscode
const rd = new Reader(`520 176
W 7536 B 10 W 509 B 12 W 506 B 16 W 504 B 16 W 503 B 18 W 501 B 20 W 500 B 20 W 499 B 22 W 498 B 22 W 498 B 22 W 498 B 22 W 498 B 22 W 462 B 10 W 26 B 22 W 461 B 12 W 25 B 22 W 459 B 16 W 23 B 21 W 460 B 16 W 23 B 21 W 459 B 18 W 22 B 20 W 459 B 20 W 21 B 2 W 1 B 16 W 460 B 20 W 21 B 2 W 1 B 16 W 459 B 22 W 20 B 2 W 3 B 12 W 263 B 500 W 20 B 500 W 20 B 500 W 20 B 500 W 182 B 10 W 26 B 22 W 20 B 2 W 439 B 12 W 25 B 22 W 20 B 2 W 437 B 4 W 8 B 4 W 23 B 21 W 21 B 2 W 437 B 2 W 12 B 2 W 23 B 21 W 21 B 2 W 436 B 2 W 14 B 2 W 22 B 20 W 22 B 2 W 435 B 3 W 14 B 3 W 21 B 2 W 1 B 16 W 23 B 2 W 328 B 2 W 105 B 2 W 16 B 2 W 21 B 2 W 1 B 16 W 23 B 2 W 141 B 2 W 185 B 2 W 104 B 3 W 16 B 3 W 20 B 2 W 3 B 12 W 25 B 2 W 141 B 2 W 185 B 2 W 104 B 2 W 18 B 2 W 20 B 2 W 4 B 10 W 26 B 2 W 141 B 2 W 185 B 2 W 104 B 2 W 18 B 2 W 20 B 2 W 40 B 2 W 141 B 2 W 185 B 2 W 104 B 2 W 18 B 2 W 20 B 2 W 40 B 2 W 141 B 2 W 185 B 2 W 104 B 2 W 18 B 2 W 20 B 2 W 40 B 2 W 141 B 2 W 185 B 2 W 68 B 10 W 26 B 2 W 18 B 2 W 20 B 2 W 40 B 2 W 100 B 10 W 31 B 2 W 185 B 2 W 67 B 12 W 25 B 3 W 16 B 3 W 20 B 2 W 40 B 2 W 99 B 12 W 30 B 2 W 185 B 2 W 65 B 4 W 8 B 4 W 23 B 3 W 16 B 2 W 21 B 2 W 40 B 2 W 97 B 4 W 8 B 4 W 28 B 2 W 185 B 2 W 65 B 2 W 12 B 2 W 23 B 4 W 14 B 3 W 21 B 2 W 40 B 2 W 97 B 2 W 12 B 2 W 28 B 2 W 185 B 2 W 64 B 2 W 14 B 2 W 22 B 4 W 14 B 2 W 22 B 2 W 40 B 2 W 96 B 2 W 14 B 2 W 27 B 2 W 185 B 2 W 63 B 3 W 14 B 3 W 21 B 2 W 1 B 2 W 12 B 2 W 23 B 2 W 40 B 2 W 95 B 3 W 14 B 3 W 26 B 2 W 185 B 2 W 63 B 2 W 16 B 2 W 21 B 2 W 1 B 4 W 8 B 4 W 23 B 2 W 40 B 2 W 95 B 2 W 16 B 2 W 26 B 2 W 185 B 2 W 62 B 3 W 16 B 3 W 20 B 2 W 3 B 12 W 25 B 2 W 40 B 2 W 94 B 3 W 16 B 3 W 25 B 2 W 135 B 116 W 18 B 204 W 18 B 144 W 20 B 116 W 18 B 204 W 18 B 144 W 20 B 116 W 18 B 204 W 18 B 144 W 20 B 116 W 18 B 204 W 18 B 144 W 70 B 2 W 26 B 10 W 26 B 2 W 18 B 2 W 20 B 2 W 40 B 2 W 40 B 2 W 94 B 2 W 18 B 2 W 25 B 2 W 185 B 2 W 25 B 12 W 25 B 3 W 16 B 3 W 20 B 2 W 40 B 2 W 40 B 2 W 94 B 3 W 16 B 3 W 25 B 2 W 185 B 2 W 23 B 4 W 8 B 4 W 23 B 3 W 16 B 2 W 21 B 2 W 40 B 2 W 136 B 3 W 16 B 2 W 26 B 2 W 185 B 2 W 23 B 2 W 12 B 2 W 23 B 4 W 14 B 3 W 21 B 2 W 40 B 2 W 136 B 4 W 14 B 3 W 26 B 2 W 185 B 2 W 22 B 2 W 14 B 2 W 22 B 4 W 14 B 2 W 22 B 2 W 40 B 2 W 136 B 4 W 14 B 2 W 27 B 2 W 185 B 2 W 21 B 3 W 14 B 3 W 21 B 2 W 1 B 2 W 12 B 2 W 23 B 2 W 40 B 2 W 136 B 2 W 1 B 2 W 12 B 2 W 28 B 2 W 185 B 2 W 21 B 2 W 16 B 2 W 21 B 2 W 1 B 4 W 8 B 4 W 23 B 2 W 40 B 2 W 102 B 2 W 32 B 2 W 1 B 4 W 8 B 4 W 28 B 2 W 185 B 2 W 20 B 3 W 16 B 3 W 20 B 2 W 3 B 12 W 25 B 2 W 40 B 2 W 102 B 2 W 32 B 2 W 3 B 12 W 30 B 2 W 185 B 2 W 20 B 2 W 18 B 2 W 20 B 2 W 4 B 10 W 26 B 2 W 40 B 2 W 102 B 2 W 32 B 2 W 4 B 10 W 31 B 2 W 185 B 2 W 20 B 2 W 18 B 2 W 20 B 2 W 40 B 2 W 40 B 2 W 102 B 2 W 32 B 2 W 45 B 2 W 185 B 2 W 20 B 2 W 18 B 2 W 20 B 2 W 40 B 2 W 40 B 2 W 102 B 2 W 32 B 2 W 45 B 2 W 185 B 2 W 20 B 2 W 18 B 2 W 20 B 2 W 40 B 2 W 40 B 2 W 102 B 2 W 32 B 2 W 45 B 2 W 171 B 10 W 4 B 2 W 20 B 2 W 18 B 2 W 20 B 2 W 40 B 2 W 40 B 2 W 102 B 2 W 11 B 10 W 11 B 2 W 31 B 10 W 4 B 2 W 170 B 12 W 3 B 2 W 20 B 3 W 16 B 3 W 20 B 2 W 40 B 2 W 40 B 2 W 102 B 2 W 10 B 12 W 10 B 2 W 30 B 12 W 3 B 2 W 168 B 16 W 1 B 2 W 20 B 3 W 16 B 2 W 21 B 2 W 40 B 2 W 144 B 2 W 8 B 16 W 8 B 2 W 28 B 16 W 1 B 2 W 168 B 16 W 1 B 2 W 20 B 4 W 14 B 3 W 21 B 2 W 40 B 2 W 144 B 2 W 8 B 16 W 8 B 2 W 28 B 16 W 1 B 2 W 167 B 20 W 20 B 4 W 14 B 2 W 22 B 2 W 40 B 2 W 144 B 2 W 7 B 18 W 7 B 2 W 27 B 20 W 166 B 21 W 20 B 2 W 1 B 2 W 12 B 2 W 23 B 2 W 40 B 2 W 144 B 2 W 6 B 20 W 6 B 2 W 26 B 21 W 166 B 21 W 20 B 2 W 1 B 4 W 8 B 4 W 23 B 2 W 40 B 2 W 144 B 2 W 6 B 20 W 6 B 2 W 26 B 21 W 165 B 22 W 20 B 2 W 3 B 12 W 25 B 2 W 40 B 2 W 144 B 2 W 5 B 22 W 5 B 2 W 25 B 22 W 135 B 500 W 20 B 500 W 20 B 500 W 20 B 500 W 50 B 22 W 20 B 2 W 40 B 2 W 40 B 2 W 144 B 2 W 5 B 22 W 5 B 2 W 25 B 22 W 165 B 22 W 20 B 2 W 40 B 2 W 40 B 2 W 144 B 2 W 5 B 22 W 5 B 2 W 25 B 22 W 166 B 20 W 21 B 2 W 40 B 2 W 186 B 2 W 5 B 21 W 6 B 2 W 26 B 20 W 167 B 20 W 21 B 2 W 40 B 2 W 186 B 2 W 5 B 21 W 6 B 2 W 26 B 20 W 168 B 18 W 22 B 2 W 40 B 2 W 186 B 2 W 5 B 20 W 7 B 2 W 27 B 18 W 170 B 16 W 23 B 2 W 40 B 2 W 186 B 2 W 5 B 2 W 1 B 16 W 8 B 2 W 28 B 16 W 171 B 16 W 23 B 2 W 40 B 2 W 186 B 2 W 5 B 2 W 1 B 16 W 8 B 2 W 28 B 16 W 173 B 12 W 25 B 2 W 40 B 2 W 186 B 2 W 5 B 2 W 3 B 12 W 10 B 2 W 30 B 12 W 176 B 10 W 26 B 2 W 40 B 2 W 186 B 2 W 5 B 2 W 4 B 10 W 11 B 2 W 31 B 10 W 213 B 2 W 40 B 2 W 186 B 2 W 5 B 2 W 25 B 2 W 254 B 2 W 40 B 2 W 186 B 2 W 5 B 2 W 25 B 2 W 254 B 2 W 40 B 2 W 186 B 2 W 5 B 2 W 25 B 2 W 254 B 2 W 40 B 2 W 172 B 10 W 4 B 2 W 5 B 2 W 25 B 2 W 254 B 2 W 40 B 2 W 171 B 12 W 3 B 2 W 5 B 2 W 25 B 2 W 254 B 2 W 211 B 16 W 1 B 2 W 5 B 2 W 281 B 2 W 211 B 16 W 1 B 2 W 5 B 2 W 281 B 2 W 210 B 20 W 5 B 2 W 281 B 2 W 209 B 21 W 5 B 2 W 281 B 2 W 209 B 21 W 5 B 2 W 281 B 2 W 208 B 22 W 5 B 2 W 209 B 500 W 20 B 500 W 20 B 500 W 20 B 500 W 92 B 2 W 208 B 22 W 5 B 2 W 281 B 2 W 208 B 22 W 5 B 2 W 492 B 20 W 6 B 2 W 492 B 20 W 6 B 2 W 493 B 18 W 7 B 2 W 494 B 16 W 8 B 2 W 494 B 16 W 8 B 2 W 496 B 12 W 10 B 2 W 497 B 10 W 11 B 2 W 518 B 2 W 518 B 2 W 518 B 2 W 518 B 2 W 518 B 2 W 3329 B 500 W 20 B 500 W 20 B 500 W 20 B 500 W 21850`);

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

const o = findNotes(img);
console.log(o);