
function parseMayan(L, H, cnt, cntV) { // Array of arrays (array per number)
   const o = [];
   
   for (let k = 0; k < cntV; k++) {
      for (let i = 0; i < H; i++) {
         const numeral = readline();
      
         for (let j = 0; j < cnt; j++) {
            const index = j + k * cnt;
            if (!o[index]) {
               o[index] = [];
            }
            o[index][i] = numeral.substring(j * L, (j + 1) * L);
         }
      }
   }
   
   return o;
}

function toMayan(number, arr) {
   const o = [];

   const log = Math.log(number) / Math.log(20);
   const logFinal = Math.abs(log) == Infinity ? 1 : Math.ceil(log + (~~log == log ? 1 : 0));

   for (let i = 0; i < logFinal; i++) {
      const exp = logFinal - i - 1;
      const val = Math.floor(number / Math.pow(20, exp)) % 20; // IDK
      const mayan = arr[val];

      o.push(mayan);
   }

   return o;
}

function compareNumbers(f, s) {
   return f.join("\n") == s.join("\n");
}

function evaluate(number, arr) {
   // This should be an array of arrays
   let o = 0;

   for (let i = 0; i < number.length; i++) {
      const n = number[i];
      const exp = number.length - 1 - i;

      const numberValue = arr.findIndex(x => compareNumbers(x, n));
      const xpVal = numberValue * Math.pow(20, exp);

      o += xpVal;
   }

   return o;
}

var inputs = readline().split(' ');
const L = parseInt(inputs[0]);
const H = parseInt(inputs[1]);

const nums = parseMayan(L, H, 20, 1);

const S1 = parseInt(readline());
const first = parseMayan(L, H, 1, S1 / H);

const S2 = parseInt(readline());
const second = parseMayan(L, H, 1, S2 / H);

const operation = readline();
const operations = [
   [ "+", (f, s) => f + s ],
   [ "-", (f, s) => f - s ],
   [ "*", (f, s) => f * s ],
   [ "/", (f, s) => f / s ]
];

const firstVal = evaluate(first, nums);
const secondVal = evaluate(second, nums);

const o = operations.find(x => x[0] == operation)[1](firstVal, secondVal);
const mayan = toMayan(o, nums);
const mayanFinal = mayan.flat().join("\n");

// console.error(first, second, operation);
// console.error(o);
console.log(mayanFinal);