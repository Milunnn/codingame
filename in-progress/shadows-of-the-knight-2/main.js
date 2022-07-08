// var inputs = readline().split(' ');
// const w = parseInt(inputs[0]); // width of the building.
// const h = parseInt(inputs[1]); // height of the building.
// const N = parseInt(readline()); // maximum number of turns before game over.
// var inputs = readline().split(' ');
// const X0 = parseInt(inputs[0]);
// const Y0 = parseInt(inputs[1]);

const pos = [
   {
      x: X0,
      y: Y0
   }
]
const centers = [];
let loc = 0;

// game loop
while (true) {
   const bombDir = readline(); // Current distance to the bomb compared to previous distance (COLDER, WARMER, SAME or UNKNOWN)

   let center = null;
   if (centers.length == 0) {
      center = {
         y: Math.round(h / 2),
         x: Math.round(w / 2)
      };
   } else {
      const vector = {
         y: pos[pos.length - 1].y - pos[pos.length - 2].y,
         x: pos[pos.length - 1].x - pos[pos.length - 2].x
      };
      const normVector = {
         y: -vector.x,
         x: vector.y
      };
      center = {
         y: centers[centers.length - 1].y + Math.round((h - centers[centers.length - 1].y) / 2),
         x: centers[centers.length - 1].x + Math.round((w - centers[centers.length - 1].x) / 2),
      };
   }

   centers.push(center);
   pos.push(center);

   console.log(center.x + " " + center.y);
}
