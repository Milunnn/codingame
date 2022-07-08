let budgets = [];

const N = parseInt(readline());
const C = parseInt(readline());
for (let i = 0; i < N; i++) {
   const B = parseInt(readline());
   budgets.push(B);
}
budgets = budgets.sort((a, b) => a - b);

if (C > budgets.reduce((s, e) => s + e, 0)) {
   console.log("IMPOSSIBLE");
} else {
   const o = [];

   let left = C;
   for (let i = 0; i < budgets.length; i++) {
      const perOod = Math.round((left / (budgets.length - i)));
      const b = budgets[i];

      const investment = Math.min(b, perOod);
      o.push(investment);
      left -= investment;
   }

   console.log(o.sort((a, b) => a - b).join("\n"));
}