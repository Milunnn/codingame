
function main(linesXArr, linesYArr, w, h) {

   const linesX = [ 0, ...linesXArr, w ];
   const linesY = [ 0, ...linesYArr, h ];

   const squares = [];

   for (let yStarti = 0; yStarti < linesY.length; yStarti++) {
      const yStart = linesY[yStarti];
      for (let xStarti = 0; xStarti < linesX.length; xStarti++) {
         const xStart = linesX[xStarti];
         for (let yEndi = yStarti + 1; yEndi < linesY.length; yEndi++) {
            const yEnd = linesY[yEndi];
            for (let xEndi = xStarti + 1; xEndi < linesX.length; xEndi++) {
               const xEnd = linesX[xEndi];
               
               // Check if square
               const x = xStart;
               const y = yStart;
               const w = xEnd - xStart;
               const h = yEnd - yStart;

               if (w == h) {
                  squares.push({
                     x,
                     y,
                     w,
                     h
                  });
               }
            }
         }
      }
   }

   return squares;
}