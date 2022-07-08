
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

usedPlaces.x.push(loc.x);
usedPlaces.y.push(loc.y);

// game loop
while (true) {
   const bombDir = readline(); // the direction of the bombs from batman's current location (U, UR, R, DR, D, DL, L or UL)

   // Take only first instruction xD
   // const c = [...bombDir][0];
   // const nw = decide(loc, c);

   // usedPlaces.push(nw);

   // console.log(nw.x + " " + nw.y);

   const dirs = [ ...bombDir ];
   // Horizontal first
   if (dirs.includes("L")) {
      loc.x--;
   } else if (dirs.includes("R")) {
      loc.x++;
   } else if (dirs.includes("U")) {
      loc.y--;
   } else if (dirs.includes("D")) {
      loc.y++;
   }

   console.log(loc.x + " " + loc.y)
}

// function decide(initialPos, dir) {

//    let {x, y} = initialPos;
//    let center = null;
//    let closest = null;

//    switch(dir) {
//       case "U":
//          // Go half the possible length up
//          center = ~~(loc.y / 2);
//          closest = getClosest(center, h - 1, usedPlaces.filter(x => x.x == initialPos.x).map(x => x.y));
//          y = closest;
//          break;
//       case "D":
//          // Go half the possible length down
//          center = loc.y + ~~((h - loc.y) / 2);
//          closest = getClosest(center, h - 1, usedPlaces.filter(x => x.x == initialPos.x).map(x => x.y));
//          y = closest;
//          break;
//       case "L":
//          // Go half the possible length left
//          center = ~~(loc.x / 2);
//          closest = getClosest(center, w - 1, usedPlaces.filter(x => x.y == initialPos.y).map(x => x.x));
//          x = closest;
//          break;
//       case "R":
//          // Go half the possible length up
//          center = loc.x + ~~((w - loc.x) / 2);
//          closest = getClosest(center, w - 1, usedPlaces.filter(x => x.y == initialPos.y).map(x => x.x));
//          x = closest;
//          break;
//    }

//    return {
//       x,
//       y
//    }
// }

function getClosest(value, max, used) {

   let i = 0;
   let val = value;

   let flagMax = false;
   let flagMin = false;

   do {
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
      i++;

      if (flagMin && flagMax) {
         return null;
      }
   } while (used.includes(val));

   return val;
}