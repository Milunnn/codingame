
let r1 = +readline();
let r2 = +readline();

while (true) {
   if (r1 == r2) break;
   if (r1 < r2) {
      r1 += [...(""+r1)].reduce((s, e) => s + (+e), 0)
   } else {
      r2 += [...(""+r2)].reduce((s, e) => s + (+e), 0)
   }
}

console.log(r1);