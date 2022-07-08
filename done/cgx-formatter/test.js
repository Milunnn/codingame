
const text = `'roles'=
(
    'vis(itor';
    'moderator'
)`;
const oldNumberOfOpenings = [...text].filter(x => x == "(").length
const numberOfOpenings = [...text].reduce((s, e) => {
   if (!s.ctx && e == "(") {
      s.cnt++;
   } else if (e == "'") {
      s.ctx = !s.ctx;
   }
   return s;
}, { ctx: false, cnt: 0 }).cnt;

console.log(oldNumberOfOpenings, numberOfOpenings)

// function gen(maxDeepness = 3, dCurr = 0, noKeyValFlag = false) {
//    const r = Math.random();

//    if (maxDeepness > dCurr) {
//       if (r < 0.33) {
//          const test = new CGXElement("");
   
//          test.type = "block";
//          test.value = [...Array(3)].map((x, xi) => gen(maxDeepness, dCurr + 1));
   
//          return test;
//       } else if (r < 0.66 && !noKeyValFlag) {
//          console.log("ASDASDASDASD")
//          const key = new CGXElement("");
//          key.type = "string";
//          key.value = "key-text";

//          const test = new CGXElement("");
//          test.type = "key-value";
//          test.value = {
//             key: key,
//             value: gen(maxDeepness, dCurr, true)
//          };
   
//          return test;
//       }
//    }

//    const test = new CGXElement("");
//    test.type = CGXElement.primitives[~~(Math.random() * CGXElement.primitives.length)];
//    test.value = test.type == "string" ? "asd" : (test.type == "number" ? `${~~(Math.random() * 100)}` : (test.type == "boolean" ? (`${Math.random() < 0.5}`) : "null"));

//    return test;
// }