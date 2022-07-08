class ReaderTS {

   private gen: null | Generator<string, void, unknown>;
   private string;

   constructor(linesString = "") {
      this.gen = null;
      this.string = linesString;
   }

   readline() {
      if ("readline" in globalThis) {
         return ((globalThis as any).readline as Function)();
      }
      if (this.gen == null) {
         this.gen = this.readlineGen();
      }
      return this.gen.next().value;
   }

   private* readlineGen() {
      const data = this.string.split("\n").map(x => x.trim());
      
      for (const d of data) {
         yield d;
      }
   }
}