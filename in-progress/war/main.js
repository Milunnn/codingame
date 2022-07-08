
class Q {

   constructor(items = []) {
      this.queue = items;
   }

   dequeue() {
      if (this.queue.length > 0) {
         return this.queue.shift();
      }
      return null;
   }

   enqueue(item) {
      this.queue.push(item);
   }
}

class P {

   /**
    * @param {number} id 
    */
   constructor(id) {
      this.id = id;
      this.deck = new Q();

      /**
       * @type {null|C}
       */
      this.revealed = null;

      /**
       * @type {Array<C>}
       */
      this.side = [];
   }

   /**
    * @param {Array<C>} cards 
    */
   addToDeck(cards) {
      cards.map(x => this.deck.enqueue(x));
   }

   /**
    * @param {P} player 
    */
   addCardsFromSide(player) {
      player.side.map(x => this.deck.enqueue(x))
      player.side = [];
   }
   /**
    * @param {P} player 
    */
   addCardFromRevealed(player) {
      if (player.revealed == null) {
         return;
      }
      this.deck.enqueue(player.revealed);
      player.revealed = null;
   }

   /**
    * @returns {boolean} If the player has enough cards to give to the side
    */
   addCardToSideFromTop() {
      if (this.deck.queue.length == 0) {
         return false;
      }
      this.side.push(this.deck.dequeue());
      return true;
   }
   /**
    * @returns {boolean} If the player has enough cards to reveal
    */
   setRevealedCardFromTop() {
      if (this.deck.queue.length == 0) {
         return false;
      }
      this.revealed = this.deck.dequeue();
      return true;
   }

   /**
    * @returns {boolean}
    */
   hasCards() {
      return this.deck.queue.length > 0 || this.revealed != null;
   }

}

class C {

   static cards = [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
      "A"
   ];

   /**
    * @param {string} name 
    * @param {string} suit 
    */
   constructor(name, suit) {
      this.name = name;
      this.suit = suit;
   }

   /**
    * @returns {number}
    */
   quantifyValue() {
      return C.cards.indexOf(this.name);
   }
}

/**
 * @param {P} p1 
 * @param {P} p2 
 * @param {number} turns 
 * @returns {{ status: string, turns: number }}
 */
function battle(p1, p2, turns = 0) {
   turns++;

   console.error(p1.deck.queue.map(x => `${x.name}${x.suit}`).join(" "))
   console.error(p2.deck.queue.map(x => `${x.name}${x.suit}`).join(" "))

   const isWar = p1.side.length > 0 || p2.side.length > 0;

   const hc1 = p1.setRevealedCardFromTop();
   const hc2 = p2.setRevealedCardFromTop();

   if (!hc1 || !hc2) {
      return {
         status: isWar ? "PAT" : (hc1 ? "1" : "2"),
         turns
      }
   }

   const c1 = p1.revealed;
   const c2 = p2.revealed;

   const v1 = c1.quantifyValue();
   const v2 = c2.quantifyValue();

   if (v1 != v2) {
      // Choose winner and loser
      const pw = v1 > v2 ? p1 : p2;
      const pl = v1 < v2 ? p1 : p2;

      // PW gets the revealed cards
      // pw.grabRevealed(pw); // His first
      pw.addCardFromRevealed(pw);
      if (isWar) {
         pw.addCardsFromSide(pw);
      }
      // pw.grabRevealed(pl); // And the opponents second
      pw.addCardFromRevealed(pl);
      if (isWar) {
         // pw.grabSideDown(pl);
         pw.addCardsFromSide(pl);
      }

   } else {
      // War
      const b = war(p1, p2);
      // turns++;
      if (b) {
         return {
            status: "PAT",
            turns
         };
      }
   }

   // Another battle
   if (turns == 3) {
      return {
         status: "ASD",
         turns
      }
   }
   return battle(p1, p2, turns);
}

/**
 * @param {P} p1 
 * @param {P} p2 
 * @returns {boolean}
 */
function war(p1, p2) {
   // Each should reveal three cards
   for (let i = 0; i < 3; i++) {
      // const c1 = p1.placeTopCardDown();
      // const c2 = p2.placeTopCardDown();
      const c1 = p1.addCardToSideFromTop();
      const c2 = p2.addCardToSideFromTop();

      if (!c1 || !c2) {
         return true;
      }
   }
   return false;
}

/**
 * @returns {string}
 */
function* _readline() {
   // const data = [ "3", "AD", "KC", "QC", "3", "KH", "QS", "JC" ];
   const p1 = "10D 9S 8D KH 7D 5H 6S".split(" ");
   const p2 = "10H 7H 5C QC 2C 4H 6D".split(" ");
   const data = [ p1.length.toString(), ...p1, p2.length.toString(), ...p2 ];
   for (const d of data) {
      yield d;
   }
}
function rl(generator) {
   return typeof readline == "function" ? readline() : generator.next().value;
}
/**
 * @param {number} cnt 
 * @returns {Array<C>}
 */
function loadPCards(cnt, gen) {
   const c = [];
   for (let i = 0; i < cnt; i++) {
      const s = rl(gen);
      const d = [ s.substring(0, s.length - 1), s.substring(s.length - 1) ]
      c.push(new C(d[0], d[1]));
   }
   return c;
}
function init() {
   const p1 = new P(1);
   const p2 = new P(2);

   const gen = _readline();

   const cl1 = parseInt(rl(gen));
   // p1.addCards(loadPCards(cl1, gen));
   p1.addToDeck(loadPCards(cl1, gen));

   const cl2 = parseInt(rl(gen));
   // p2.addCards(loadPCards(cl2, gen));
   p2.addToDeck(loadPCards(cl2, gen));

   // console.error(p1, p2)
   const status = battle(p1, p2);
   console.log(status.status + " " + status.turns);
}

init();