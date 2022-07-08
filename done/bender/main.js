
class Bender {

   static directionPrioritiesOriginal = ["S", "E", "N", "W"];

   constructor(position) {
      this.position = position;
      this.directionPriorities = [ ...Bender.directionPrioritiesOriginal ];
      this.buffs = {
         inverted: false,
         breaker: false
      };
      this.positionCache = [];
   }

   summarizeCacheData(position, mapData) {
      return [
         position.x,
         position.y,
         this.buffs.breaker,
         this.buffs.inverted,
         this.directionPriorities.join(""),
         mapData.flat().join("")
      ].join(" ");
   }

   move(position, mapData) {
      // Remember all states as a string to determine if he is in loop
      if (this.positionCache.length == 0) {
         // Push the first, then move, then push second
         this.positionCache.push(this.summarizeCacheData(this.position, mapData));
      }

      const nw = this.summarizeCacheData(position, mapData);
      const cachePos = this.positionCache.find(x => nw == x);
      if (cachePos != undefined) {
         // Is in loop (probably)
         return false;
      }

      this.position = { ...position };
      this.positionCache.push(this.summarizeCacheData(this.position, mapData));

      return true;
   }

   changeDirection(dir) {
      // Change priority to the given dir (prepend that dir to the original)
      this.directionPriorities = [ dir, ...Bender.directionPrioritiesOriginal.filter(x => x != dir) ];
   }

   resolveModifierBlocks(mapData) {
      const b = mapData[this.position.y][this.position.x];

      if (Bender.directionPrioritiesOriginal.includes(b)) {
         this.changeDirection(b);
      }
      if (b == "I") {
         this.buffs.inverted = !this.buffs.inverted;
      }
      if (b == "B") {
         this.buffs.breaker = !this.buffs.breaker;
      }
      if (b == "T") {
         const otherTeleporter = mapData
            .map((y, yi) => ({ y: yi, x: y.findIndex((x, xi) => x == "T" && (yi != this.position.y || xi != this.position.x)) }))
            .reduce((s, e) => (s.x != -1 && s.y != -1) ? s : e);

         this.move(otherTeleporter, mapData);
      }

      if (b == "X") {
         // This means that e broke wall (and is on standing it right now)
         mapData[this.position.y][this.position.x] = " "; // Replace the wall with nothing
      }
   }

   tick(mapData) {
      const nextPos = this.getFirstAccessiblePosition(mapData);
      const moved = this.move(nextPos.position, mapData);

      if (!moved) {
         return "LOOP";
      }

      this.changeDirection(nextPos.direction);
      this.resolveModifierBlocks(mapData);

      return nextPos;
   }

   static tickTillEnd(bender, mapData) {
      const moves = [];

      while (true) {
         // console.error("position", bender.position);
         const move = bender.tick(mapData);

         if (move == "LOOP") {
            return "LOOP";
         }

         moves.push(move);

         if (mapData[move.position.y][move.position.x] == "$") {
            return moves;
         }
      }
   }

   resolveDirectionPriorities() {
      // return this.buffs.inverted ? [ this.directionPriorities[0], ...Bender.directionPrioritiesOriginal.reverse() ] : this.directionPriorities;
      if (this.buffs.inverted) {
         const n = [ this.directionPriorities[0], ...[ ...Bender.directionPrioritiesOriginal ].reverse() ];
         return n;
      }
      return this.directionPriorities;
   }

   getNextPosition(direction) {
      const x = this.position.x + (direction == "E" ? 1 : 0) + (direction == "W" ? -1 : 0);
      const y = this.position.y + (direction == "S" ? 1 : 0) + (direction == "N" ? -1 : 0);

      return {
         x,
         y
      };
   }

   canGo(block) {
      return ![ "#", "X" ].includes(block) || (this.buffs.breaker && block != "#");
   }

   getFirstAccessiblePosition(mapData) {
      for (const d of this.resolveDirectionPriorities()) {
         const next = this.getNextPosition(d);
         const nextBlock = mapData[next.y][next.x];
         if (this.canGo(nextBlock)) {
            return {
               position: next,
               direction: d
            };
         }
      }
      return null;
   }
}

const map = [];
let bender = null;

var inputs = readline().split(' ');
const L = parseInt(inputs[0]);
const C = parseInt(inputs[1]);
for (let i = 0; i < L; i++) {
   const row = readline();
   map.push([...row].map(x => x == "@" ? " " : x));

   const ind = row.indexOf("@");
   if (ind !== -1 && bender == null) {
      bender = new Bender({
         x: ind,
         y: i
      })
   }
}
const moves = Bender.tickTillEnd(bender, map);
const directions = [ "SOUTH", "EAST", "NORTH", "WEST" ];
const final = moves == "LOOP" ? moves : moves.map(x => directions.find(y => y.startsWith(x.direction))).join("\n");

console.log(final);