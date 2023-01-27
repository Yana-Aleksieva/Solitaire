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

    // Placeholders to be registered from outside
    onNewGame() {
    }

    setGameState(state) {
        this.connection.send('state', state);
    }
}