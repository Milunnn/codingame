/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

const area = [];
const cache = {};

let robot = {
   position: null,
   direction: "up"
};

var inputs = readline().split(' ');
const w = parseInt(inputs[0]);
const h = parseInt(inputs[1]);
const n = parseInt(readline());
for (let i = 0; i < h; i++) {
   const line = readline();
   area.push([...line].map((x, xi) => x == "O" ? "." : x));

   const indexOfRobot = line.indexOf("O");
   if (indexOfRobot != -1) {
      robot.position = {
         x: indexOfRobot,
         y: i
      }
   }
}

const dirs = [
   {
      check: "up",
      func: pos => ({ ...pos, y: pos.y - 1 })
   },
   {
      check: "down",
      func: pos => ({ ...pos, y: pos.y + 1 })
   },
   {
      check: "left",
      func: pos => ({ ...pos, x: pos.x - 1 })
   },
   {
      check: "right",
      func: pos => ({ ...pos, x: pos.x + 1 })
   }
]

function tick(area, robot, rnd, rndMax) {

   const initialDir = robot.direction;
   const initialPos = robot.position;
   const c = initialDir + " " + initialPos.x + " " + initialPos.y;

   if (c in cache) {
      // Check if he already was here (with his direction)
      const d = cache[c];
      const rndLength = rnd - d.rnd;
      const loopCount = Math.floor((rndMax - rnd) / rndLength);
      const rndsAdded = loopCount * rndLength;

      // robot.position = d.position;
      if (rndsAdded > 0) {
         return rndsAdded;
      }
   }

   const d = dirs.find(x => x.check == robot.direction).func;
   const next = d(robot.position);

   if (area[next.y][next.x] == "#") {
      robot.direction = rotate(robot.direction);
      return tick(area, robot, rnd, rndMax);
   }

   robot.position = next;

   cache[c] = {position: robot.position, rnd: rnd};
   return 1;
}

function rotate(dir) {
   if (dir == "up") return "right";
   if (dir == "down") return "left";
   if (dir == "left") return "up";
   return "down";
}

for (let i = 0; i < n;) {
   const tookRounds = tick(area, robot, i, n - 1);
   i += tookRounds;
}

console.log(robot.position.x + " " + robot.position.y);