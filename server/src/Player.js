import { Connection } from './connection.js';


export class Player {
    /** @type {Connection} */
    connection = null;

    constructor(connection) {
        this.connection = connection;
        this._initEventListeners();
    }

    _initEventListeners() {
        this.connection.on('newGame', () => {
            console.log('new game');
            this.onNewGame();
        });
    }

    onNewGame() {
        // Placeholders to be registered from outside
    }

    setGameState(state) {
        this.connection.send('state', state);
    }

    setValidMoves(moves) {
        this.connection.send('moves', moves);
    }
}