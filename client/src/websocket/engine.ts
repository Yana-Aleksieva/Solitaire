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
    let sprites = createSprites();


    let flipContainer;



    function onStart(state) {
        // add canvas
        const app = new PIXI.Application({
            background: "0x006E33",
            width: window.innerWidth,
            height: window.innerHeight,
        });
        //  console.log(state.waste.cards)

        async function init() {
            await PIXI.Assets.load("/assets/sprite.jpg");
            await PIXI.Assets.load("/assets/back.png");
        }

        init().then(() => start(state))
        // .then(() => shuffleCards(cards))
        //  .then(() => dealCards(cards, fields, app))



        async function start(state) {
            // create cards
            interface TypeCard {
                face: number;
                suit: string;
                faceUp: boolean;
            }
            document.body.appendChild(app.view as HTMLCanvasElement);
            // Dependency Injection ???

            const container = new Tank(50, 70, state.stock.cards, onFlip.bind(null));
            // console.log(container.cards)
            flipContainer = new GameField(-1, WINDOW_WIDTH / 7 * 2 - 210, 70, state.waste.cards, 'waste');


            const piles = state.piles;
            const suites = createSuitsImages();

            let fields: GameField[] = getFields(state.piles);

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

            function onFlip() {
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
                    // console.log(move.index);
                    connection.send('move', move);


                }
            }

            // function onTake() {



            // }

            fields.forEach(f => f.on('pointertap', (e) => {

                let lastCard = f.cards[f.cards.length - 1]
                move = {
                    action: 'take',
                    source: `${f.type}`,
                    target: null,
                    index: f.cards.indexOf(lastCard)

                };
                connection.send('move', move);
                console.log(e.target);
                console.log(moves.piles);
               // if()

                
            }))

        }




        function onClick() {

        }

        function onMove(moves) {
            console.log(moves);
        }


    }
    function onResult(data) {
         console.log(move, data);
        if (move != null) {
            // console.log(move.action)
            if (move.action == 'flip') {
                if (move.source == 'stock') {


                    if (state.stock.cards.length > 0) {
                        console.log(state);
                        state.stock.cards.pop();
                        state.waste.cards.push(data);
                        flipContainer.cards = state.waste.cards;
                        // //console.log(flipContainer.cards);
                        const currentCard = sprites.find((s) => s.face == data.face && s.suite == data.suit);
                        // //console.log(currentCard);
                        flipContainer.addChild(currentCard.sprite);
                        // } 
                        stateToStage(state)
                    } else {
                        state.waste.cards.reverse();
                        state.stock.cards.push(...state.waste.cards);
                        state.stock.cards.forEach(c => c.faceUp = false);
                        state.waste.cards.length = 0;
                    }

                } else if (move.action == 'place' && data == true) {

                    let validMoves = null;
                    if (move.source == 'stock') {
                        validMoves = data;
                        // console.log(moves)
                        console.log(validMoves, moves.waste, 'oooooooooooo');
                    }


                }
            }

        }
    }


    function onMoves(receivedMoves) {
        moves = receivedMoves;
        console.log('received moves', moves);
        //console.log(moves);
        mergeMoves();
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

    function stateToStage(state) {
        console.log(state);
        //  onStart(state)
    }

}
