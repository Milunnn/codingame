
class L {

   constructor(axis, value) {
       this.x = axis == "x" ? value : -1;
       this.y = axis == "y" ? value : -1;
   }
}

class R {

   constructor(x, y, w, h) {
       this.x = x;
       this.y = y;
       this.w = w;
       this.h = h;

       this.value = this.valueOf();
   }

   intersect(line, arr) {
       if (
           (line.x > this.x && line.x < this.x + this.w)
           ||
           (line.y > this.y && line.y < this.y + this.h)
       ) {
           // It is inside
           // const dim = line.x == -1 ? "y" : "x";
           // const d = dim == "x"
           const d = line.y == -1

           const w1 = d ? (line.x - this.x) : this.w;
           const h1 = d ? this.h : (line.y - this.y);

           const x2 = d ? w1 : this.x;
           const y2 = d ? this.y : h1;
           const w2 = d ? (this.x + this.w - w1) : this.w;
           const h2 = d ? this.h : (this.y + this.h - h1);

           const first = new R(this.x, this.y, w1, h1);
           const second = new R(x2, y2, w2, h2);

           return [ first, second ];
           // arr.push(first, second)
       }
       return [];
   }

   valueOf() {
       return `${this.x} ${this.y} ${this.w} ${this.h}`
   }

}

var inputs = readline().split(' ');
const w = parseInt(inputs[0]);
const h = parseInt(inputs[1]);
const countX = parseInt(inputs[2]);
const countY = parseInt(inputs[3]);

const lines = []

var inputs = readline().split(' ');
for (let i = 0; i < countX; i++) {
   const x = parseInt(inputs[i]);
   lines.push(new L("x", x))
}
var inputs = readline().split(' ');
for (let i = 0; i < countY; i++) {
   const y = parseInt(inputs[i]);
   lines.push(new L("y", y))
}

function getUnique(rects) {
   const uniq = [];
   rects.forEach(x => {
       if (uniq.some(y => y.value == x.value)) {
           return;
       }
       uniq.push(x);
   });
   return uniq;
}

let rects = [ new R(0, 0, w, h) ];
const start = Date.now();
let c = 0;
for (const l of lines) {
console.error(rects.length)

   // const b = [];
   // for (const r of rects) {
   //     const i = r.intersect(l);
   //     if (i.length == 0) continue;
   //     if (b.some(y => y.value == i[0].value)) continue;
   //     if (b.some(y => y.value == i[1].value)) continue;
   //     b.push(...i);
   // }
   // rects.push(...b);

   // const splitRects = [];
   // for (let i = 0; i < rects.length; i++) {
   //     splitRects.push(rects[i].intersect(l))
   // }

   const splitRects = rects.flatMap(x => x.intersect(l));

   // rects = [ ...rects, ...splitRects ];
   // rects = getUnique(rects);

   // rects = [ ...rects, ...getUnique(splitRects) ];
   rects.push.apply(rects, getUnique(splitRects))

   // console.error(rects.length);
   console.error(Date.now(), ++c)
}
const end = Date.now();

const squares = rects.filter(x => x.w == x.h)
const uniq = getUnique(squares);

console.error(uniq)
console.error(end - start)
console.log(uniq.length)