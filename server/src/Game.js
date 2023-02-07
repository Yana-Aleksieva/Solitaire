import { createState, dealDeckToState } from './cardFactory.js';
import { Deck } from './cards.js';
import { Player } from './Player.js';


export class Game {
    /** @type {Player} */
    player = null;
    state = null;

    /**
     * 
     * @param {Player} player 
     */
    addPlayer(player) {
        this.player = player;

        this.player.onNewGame = this.newGame.bind(this);
        
        // if game is ongoing, send current state, else make a new state
        if (this.state == null) {
            this.newGame();
        }
        this.player.setGameState(this.state);
        this.player.setValidMoves(this.calcMoves());
    }

    newGame() {
        const deck = new Deck();
        deck.shuffle();
        deck.shuffle();
        deck.shuffle();
        deck.shuffle();
        deck.shuffle();
        this.state = createState();
        dealDeckToState(deck, this.state);
    }

    calcMoves() {
        const moves = [];

        

        return moves;
    }
}