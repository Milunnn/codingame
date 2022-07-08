// class P {

//    /**
//     * @param {number} id 
//     */
//    constructor(id) {
//       this.id = id;
//       this.deck = new Q();
//       this.sideDown = new Q();
//       /**
//        * @type {Array<C>}
//        */
//       this.revealed = [];
//    }

//    /**
//     * @returns {C|null}
//     */
//    revealTopCard() {
//       const card = this.deck.dequeue();
//       if (card == null) {
//          // throw "NO CARDS LEFT";
//          return null;
//       }
//       this.revealed.push(card);
//       return card;
//    }
//    showRevealedCards() {
//       return this.revealed.length == 0 ? null : this.revealed;
//    }

//    /**
//     * @returns {C|null}
//     */
//    placeTopCardDown() {
//       const card = this.deck.dequeue();
//       if (card == null) {
//          return null;
//       }
//       this.sideDown.enqueue(card); // Maybe not queue, more like stack
//       // this.sideDown.queue.unshift(card); // -- Like this
//       return card;
//    }
//    showSideCards() {
//       return this.sideDown.length == 0 ? null : this.sideDown;
//    }
//    /**
//     * @param {P} player 
//     */
//    grabSideDown(player) {
//       this.addCards(player.disownSideDown())
//    }
//    /**
//     * @returns {Array<C>} cards
//     */
//    disownSideDown() {
//       const sd = this.sideDown;
//       this.sideDown = [];
//       return sd;
//    }

//    /**
//     * @param {Array<C>} cards 
//     */
//    addCards(cards) {
//       cards.map(x => this.deck.enqueue(x));
//    }
//    hasCards() {
//       return this.revealed.length > 0 || this.deck.queue.length > 0;
//    }

//    /**
//     * @param {P} player 
//     */
//    grabRevealed(player) {
//       this.addCards(player.disownRevealed())
//    }
//    /**
//     * @access private
//     * @returns {Array<C>} cards
//     */
//    disownRevealed() {
//       const rev = this.revealed;
//       this.revealed = [];
//       return rev;
//    }

   
// }

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