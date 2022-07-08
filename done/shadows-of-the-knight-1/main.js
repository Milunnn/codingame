
var inputs = readline().split(' ');
const w = parseInt(inputs[0]); // width of the building.
const h = parseInt(inputs[1]); // height of the building.
const N = parseInt(readline()); // maximum number of turns before game over.
var inputs = readline().split(' ');
const X0 = parseInt(inputs[0]);
const Y0 = parseInt(inputs[1]);

// X:Y
const usedPlaces = {
   x: [],
   y: []
};

const loc = {
   x: X0,
   y: Y0
}
const lvl = {
   x: 1,
   y: 1
}

usedPlaces.x.push(loc.x);
usedPlaces.y.push(loc.y);

// game loop
while (true) {
   const bombDir = readline(); // the direction of the bombs from batman's current location (U, UR, R, DR, D, DL, L or UL)

   const dirs = [ ...bombDir ];
   // Horizontal first
   if (dirs.includes("L")) {
      loc.x = getClosest(Math.round(loc.x - Math.max(1, (w / Math.pow(2, lvl.x++)))), w - 1, usedPlaces.x);
      usedPlaces.x.push(loc.x);
   } else if (dirs.includes("R")) {
      loc.x = getClosest(Math.round(loc.x + Math.max(1, (w / Math.pow(2, lvl.x++)))), w - 1, usedPlaces.x);
      usedPlaces.x.push(loc.x);
   }
   if (dirs.includes("U")) {
      loc.y = getClosest(Math.round(loc.y - Math.max(1, (h / Math.pow(2, lvl.y++)))), h - 1, usedPlaces.y);
      usedPlaces.y.push(loc.y);
   } else if (dirs.includes("D")) {
      loc.y = getClosest(Math.round(loc.y + Math.max(1, (h / Math.pow(2, lvl.y++)))), h - 1, usedPlaces.y);
      usedPlaces.y.push(loc.y);
   }

   console.log(loc.x + " " + loc.y)
}

function getClosest(value, max, used) {

   let i = -1;
   let val = Math.min(Math.max(0, value), max);

   let flagMax = false;
   let flagMin = false;

   do {
      i++
      if (i == 0) {
         continue;
      }

      const prev = val;

      if (!flagMax && i % 2 == 1) {
         val += i;
         if (val > max) {
            val = prev;
            flagMax = true;
         }
      } else {
         val -= i;
         if (val < 0) {
            val = prev;
            flagMin = true;
         }
      }

      if (flagMin && flagMax) {
         return null;
      }
   } while (used.includes(val));

   return val;
}