import { Player } from './Player.js';


const states = {

};

export class Game {
    /** @type {Player} */
    player = null;
    state = {};

    /**
     * 
     * @param {Player} player 
     */
    addPlayer(player) {
        this.player = player;

        this.player.onNewGame = this.newGame.bind(this);
        
        this.newGame();
    }

    newGame() {
        // TODO: initialize decks
        console.log('new game');
        this.player.setGameState(this.state);
    }
}