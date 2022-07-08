
class Influencer {

   constructor(value) {
      this.value = value;
      this.influenced = [];
   }

   influence(other) {
      if (this.value == other.value) {
         return;
      }

      this.influenced.push(other);
   }

   getMaxDepth() {
      return 1 + this.influenced.map(x => x.getMaxDepth()).reduce((s, e) => s < e ? e : s, 0)
   }

   static influence(firstValue, secondValue, nodeList) {
      let first = nodeList.find(x => x.value == firstValue);
      let second = nodeList.find(x => x.value == secondValue);

      if (!first) {
         first = new Influencer(firstValue);
         nodeList.push(first);
      }
      if (!second) {
         second = new Influencer(secondValue);
         nodeList.push(second);
      }

      first.influence(second);
   }

   static getMaxDepth(nodeList) {
      return nodeList.map(x => x.getMaxDepth()).reduce((s, e) => s > e ? s : e, 0);
   }
}

const infl = [];

const n = parseInt(readline()); // the number of relationships of influence
for (let i = 0; i < n; i++) {
   var inputs = readline().split(' ');
   const x = parseInt(inputs[0]); // a relationship of influence between two people (x influences y)
   const y = parseInt(inputs[1]);

   Influencer.influence(x, y, infl);
}

console.error(infl.map(x => [ x.value, x.getMaxDepth() ]));
console.log(Influencer.getMaxDepth(infl));