/**
 * @param {P} p1 
 * @param {P} p2 
 * @param {number} turns 
 * @returns {{ status: string, turns: number }}
 */
 function battle(p1, p2, turns = 0) {

   // const shouldLay = p1.showRevealedCards() == null || p2.showRevealedCards() == null; // If no laying, then it means its the war
   // if (shouldLay) {
   //    p1.revealTopCard();
   //    p2.revealTopCard();
   // }

   p1.revealTopCard();
   p2.revealTopCard();

   const p1rev = p1.showRevealedCards();
   const p2rev = p2.showRevealedCards();

   if (p1rev == null) {
      return {
         status: "2",
         turns
      };
   }
   if (p2rev == null) {
      return {
         status: "1",
         turns
      };
   }

   const c1 = p1rev[0];
   const c2 = p2rev[0];

   const v1 = c1.quantifyValue();
   const v2 = c2.quantifyValue();

   if (v1 != v2) {
      // Choose winner and loser
      const pw = v1 > v2 ? p1 : p2;
      const pl = v1 < v2 ? p1 : p2;

      const isWar = pl.sideDown.queue.length != 0;

      // PW gets the revealed cards
      pw.grabRevealed(pw); // His first
      if (isWar) {
         pw.grabSideDown(pw);
      }
      pw.grabRevealed(pl); // And the opponents second
      if (isWar) {
         pw.grabSideDown(pl);
      }

      if (!pl.hasCards()) {
         // if (shouldLay == false) {
         if (isWar) {
            // This is war
            return {
               status: "PAT",
               turns
            };
         }
         return {
            status: pw.id.toString(),
            turns
         };
      }
   } else {
      // War
      const b = war(p1, p2);
      turns++;
      if (b) {
         return {
            status: "PAT",
            turns
         };
      }
   }

   // Another battle
   return battle(p1, p2, turns + 1);
}