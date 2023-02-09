import { Connection } from "./Connection";
import * as PIXI from "pixi.js";
import { GameField } from "../GameFields";
import {
    addCardInGameField,
    createSuitsImages,
    getFields,
    createSprites,
    fillPiles,
} from "../utils/Factory";
import { field, field1, field2, field3 } from "../utils/gameField";
import { Tank } from "../Tank";
import { TextArea } from "../utils/TextArea";
import { CARD_HEIGHT, CARD_WIDTH, WINDOW_HEIGHT, WINDOW_WIDTH } from "../utils/constants";
import { dealCards, shuffleCards } from "../animations";
import { State } from "pixi.js";
import { Card } from "../Card";

export function engine(connection: Connection) {
    let state: any = {};
    let move = null;
    let moves = null;
    let cachedMoves = null;
    let takeSource = null;

    connection.on('state', onState);
    connection.on('moves', onMoves);
    connection.on('moveResult', onResult);
    connection.on('victory', onVictory);
    let sprites = createSprites()
    const flipContainer = new GameField(-1, WINDOW_WIDTH / 7 * 2 - 210, 70, [], 'flip');
    console.log(state)



    function onStart(data: any) {
        // add canvas
        const app = new PIXI.Application({
            background: "0x006E33",
            width: window.innerWidth,
            height: window.innerHeight,
        });

        document.body.appendChild(app.view as HTMLCanvasElement);
        // Dependency Injection ???

        const container = new Tank(50, 70, data.stock.cards);
        const piles = data.piles;
        const suites = createSuitsImages();

        let fields: GameField[] = [];

        async function init() {
            await PIXI.Assets.load("/assets/sprite.jpg");
            await PIXI.Assets.load("/assets/back.png");
        }

        init().then(start)
        // .then(() => shuffleCards(cards))
        //  .then(() => dealCards(cards, fields, app))

        interface TypeCard {
            face: number;
            suit: string;
            faceUp: boolean;
        }

        async function start() {
            // create cards


            // render cards in container 
            //console.log(container.cards)
            container.cards.forEach((card) => {
                const back: PIXI.Sprite = new PIXI.Sprite(
                    new PIXI.Texture(new PIXI.BaseTexture("/assets/back.png"))
                );
                back.width = CARD_WIDTH;
                back.height = CARD_HEIGHT;
                container.addChild(back);
            })


            fields = getFields(data.piles);
            //console.log(fields);
            fields.forEach((field) => {
                let bottomPositon = 0;
                //render cards from server
                field.cards.forEach((card, i) => {
                    // console.log(card);
                    if (!card.faceUp) {
                        const back: PIXI.Sprite = new PIXI.Sprite(
                            new PIXI.Texture(new PIXI.BaseTexture("/assets/back.png"))
                        );
                        back.width = CARD_WIDTH;
                        back.height = CARD_HEIGHT;
                        back.position.set(0, bottomPositon);
                        field.addChild(back);
                    } else {
                        const currentCard = sprites.find((s) => s.face == card.face && s.suite == card.suit);
                        currentCard.sprite.position.set(0, bottomPositon);
                        //console.log(currentCard);
                        field.addChild(currentCard.sprite);
                    }
                    bottomPositon += 40;
                })
            });

            let score = new TextArea("Score: 0");
            let time = new TextArea("Time: 0.0");
            //const searchCard = cards.find((c) => c.suite = "")
            app.stage.addChild(
                field,
                field1,
                field2,
                field3,
                ...fields,
                container,
                flipContainer,
                score,
                time
            );

            score.position.set(WINDOW_WIDTH - 300, 30);
            time.position.set(WINDOW_WIDTH - 100, 30);


            container.on('pointertap', (e) => {


                const action = 'flip';
                const type = 'stock';
                let currentCard = container.cards[container.cards.length - 1];

                if (currentCard) {

                    move = {
                        action,
                        source: type,
                        target: null,
                        index: container.cards.indexOf(currentCard)
                    };
                    console.log(move.index);
                    connection.send('move', move);

                }

            });

            flipContainer.on('pointertap', (e) => {
                let validMoves = [];
               // console.log('click-flipcontainer');
                let lastCard = flipContainer.cards[flipContainer.cards.length - 1];
                if (lastCard) {
                    //console.log(lastCard);
                    //console.log(moves.waste.take);
                    move = {
                        action: 'take',
                        source: 'stock',
                        target: null,
                        index: flipContainer.cards.indexOf(lastCard)

                    };
                    // console.log(move.action)
                    connection.send('moves', move);
              
                    // state.piles.forEach(p => {
                    //     //console.log(p.moves.place, state.piles)
                    //     if (p.moves.place) {
                    //         validMoves.push(p);
                    //         console.log(p.moves.place, 'yes')
                    //     }
                    // });
                    // moves.foundations.forEach(p => {
                    //     if (p.place === true) {
                    //         if (p.place === true) {
                    //             validMoves.push(p);
                    //         }
                    //     }
                    // });
                 
                }
            });

        }




        function onClick() {

        }

        function onMove(moves) {
            console.log(moves);
        }


    }
    function onResult(data) {
       // console.log(move, data);
        if (move != null) {
            // console.log(move.action)
            if (move.action == 'flip') {
                if (move.source == 'stock') {
                    // const currentCard = sprites.find((s) => s.face == data.face && s.suite == data.suit);
                    // console.log(currentCard);
                    // flipContainer.addChild(currentCard.sprite);
                    // flipContainer.cards.push(data);
                    // container.cards.pop();
                    // container.removeChild(container.children[container.children.length-1])
                    // }
                    // 
                    if (state.stock.cards.length > 0) {
                        state.stock.cards.pop();
                        state.waste.cards.push(data);
                        flipContainer.cards = state.waste.cards;
                        //console.log(flipContainer.cards);
                        const currentCard = sprites.find((s) => s.face == data.face && s.suite == data.suit);
                        //console.log(currentCard);
                        flipContainer.addChild(currentCard.sprite);
                    } else {
                        state.waste.cards.reverse();
                        state.stock.cards.push(...state.waste.cards);
                        state.stock.cards.forEach(c => c.faceUp = false);
                        state.waste.cards.length = 0;
                    }
                }

            } else if (move.action == 'take' && data == true) {

                let validMoves = null;
                if (move.source == 'stock') {
                    validMoves = moves;
                    console.log(moves)
                }

                //console.log(validMoves)
            }
        }

    }
    function onMoves(receivedMoves) {
        moves = receivedMoves;
        console.log('received moves', moves);
        console.log(moves);
        //mergeMoves();
    }
    function onState(receivedState) {
        console.log('received state', receivedState);
        state = receivedState;
        onStart(state);
    }

    function mergeMoves() {
        state.stock.moves = moves.stock;
        state.waste.moves = moves.waste;
        Object.values(state.foundations).forEach((f: any) => f.moves = moves.foundations[f.suit]);
        state.piles.forEach((p, i) => p.moves = moves.piles[i]);
    }


    function onVictory() {
        alert('Victory!');
        connection.send('newGame');
    }


}
