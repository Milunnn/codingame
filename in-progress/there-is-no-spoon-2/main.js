
class Node {

   static id = 0;

   constructor(value) {

      this.id = Node.id++;

      /**
       * @type {Array<{node: Node, connections: number}>}
       */
      this.neighbors = [];

      this.value = value;
   }

   addNeighbor(node) {
      this.neighbors.push({
         node,
         connections: 0
      });
   }
   addConnection(node) {
      const n = this.neighbors.find(x => x.node.id == node.id);
      if (n == null) {
         return false;
      }
      
      n.connections++;
      n.node.neighbors.find(x => x.node.id == this.id).connections++;
   }

   getSaturation() {
      return this.neighbors.reduce((s, e) => s + e.connections, 0) / this.value;
   }

   getPrio() {
      return 18 - Math.floor(this.getSaturation() * this.value) - this.value;//wtf
   }

   getAvailableConnections() {
      return this.neighbors.reduce((s, e) => s + (e.node.getSaturation() == 1 ? 0 : (2 - e.connections)), 0);
   }
}

function connectAll(nodes) {
   
   while(true) {
      const n = nodes.sort((a, b) => b.getPrio() - a.getPrio())[0];

   }
}