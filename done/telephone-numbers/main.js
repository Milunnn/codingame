class TreeNode {

   constructor(val) {
      /**
       * @type {string}
       */
      this.value = val;
      /**
       * @type {Array<TreeNode>}
       */
      this.subNodes = [];
   }

   /**
    * @param {Array<string>} seq 
    */
   addSequence(seq) {
      if (seq.length == 0) return this;

      const el = seq[0];
      let sub = this.subNodes.find(x => x.value == el);

      if (sub == null) {
         // Create one
         sub = new TreeNode(el);
         this.subNodes.push(sub);
      };

      sub.addSequence(seq.slice(1));
   }

   count() {
      return this.subNodes.length + this.subNodes.reduce((s, e) => s + e.count(), 0);
   }

}

const numbers = new TreeNode("_");

const N = parseInt(readline());
for (let i = 0; i < N; i++) {
   const telephone = readline();

   numbers.addSequence([...telephone]);
}

// The number of elements (referencing a number) stored in the structure.
console.log(numbers.count());
