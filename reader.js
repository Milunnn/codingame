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