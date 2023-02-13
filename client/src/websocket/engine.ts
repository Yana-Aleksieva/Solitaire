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
    let previousMove = null;
    let previousCard = null;
    let cachedMoves = null;
    let takeSource = null;
    let fields: GameField[];

    connection.on('state', onState);
    connection.on('moves', onMoves);
    connection.on('moveResult', onResult);
    connection.on('victory', onVictory);
    let sprites = createSprites();


    let flipContainer: GameField;



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
      
            flipContainer = new GameField(-1, WINDOW_WIDTH / 7 * 2 - 210, 70, state.waste.cards, 'stock');
            flipContainer.on("pointertap", onPlace)
            // flipContainer.on("pointertap", () => {
            //     const lastCard = flipContainer.cards[flipContainer.cards.length - 1];
            //     const lastIndex = container.cards.indexOf(lastCard);

            //     move = {
            //         action: 'take',
            //         source: `stock`,
            //         target: null,
            //         index: flipContainer.cards.length - 1
            //     };
            //     connection.send('move', move);
                
            // })

            const piles = state.piles;
            const suites = createSuitsImages();

            fields = getFields(state.piles);

            container.cards.forEach((card) => {
                const back: PIXI.Sprite = new PIXI.Sprite(
                    new PIXI.Texture(new PIXI.BaseTexture("/assets/back.png"))
                );
                back.width = CARD_WIDTH;
                back.height = CARD_HEIGHT;
                container.addChild(back);
            })

            fields.forEach((field) => {
                let bottomPositon = 0;
                //render cards from server
                field.cards.forEach((card, i) => {
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

            fields.forEach(f => f.on('pointertap', onPlace));

            function onPlace(e: MouseEvent) {
                const f = e.target as GameField;
                
                console.log(f.type);
                let lastCard = f.cards[f.cards.length - 1];
                console.log(lastCard, f, 'faceUp')

                if (lastCard.faceUp == true) {
                    move = {
                        action: 'take',
                        source: `${f.type}`,
                        target: null,
                        index: f.cards.indexOf(lastCard)

                    };
                    let target = e.target as GameField;

                    connection.send('move', move);
                    let indexTrue;

                    moves.piles.find((p, i) => {
                        if (p.place == true) {
                            indexTrue = i;
                        }
                    });
                    let type = target.type.substring(4);

                    //console.log(indexTrue, moves, type, move.source);
                    if (Number(type) === indexTrue) {
                        console.log(moves, e.type, state.piles);
                        console.log(previousMove);

                        move = {
                            action: 'place',
                            source: previousMove.source,
                            target: move.source,
                            index: previousMove.index
                        };

                        connection.send('move', move);
                        // console.log(move);
                        let target = fields.find(f => f.type == move.source);
                        let source = fields.find(f => f.type == previousMove.source);
                        console.log(target, source);
                    }
                    previousMove = move;

                } else {

                    move = {
                        action: 'flip',
                        source: f.type,
                        target: null,
                        index: f.cards.indexOf(lastCard)
                    };
                    console.log(move.index, f.cards.indexOf(lastCard));
                    connection.send('move', move);
                }
            }

            function onClick() {

            }

            function onMove(moves) {
                console.log(moves);
            }
        }
    }

    function onResult(data) {
        console.log(move, data, 'onResult');
        if (move != null) {
            // console.log(move.action)
            if (move.action == 'flip') {
                if (move.source == 'stock') {
                    if (state.stock.cards.length > 0) {
                        console.log(state);
                        state.stock.cards.pop();
                        state.waste.cards.push(data);
                        flipContainer.cards = state.waste.cards;
                        const currentCard = sprites.find((s) => s.face == data.face && s.suite == data.suit);
                        flipContainer.addChild(currentCard.sprite);
                        //flipContainer.cards.push(data);
                        // } 
                        //stateToStage(state)
                    } else {
                        state.waste.cards.reverse();
                        state.stock.cards.push(...state.waste.cards);
                        state.stock.cards.forEach(c => c.faceUp = false);
                        state.waste.cards.length = 0;
                    }
                }else{
                    console.log(data, 'resulr')
                }
            } else if (move.action == 'take') {
                //console.log(previousCard, 'take');
            } else if (move.action == 'place' && data == true) {
                let validMoves = null;
                console.log(move);
                if (move.source == 'stock') {
                    validMoves = data;
                    let currentCard = flipContainer.cards[flipContainer.cards.length - 1];
                    let target = fields.find(f => f.type == previousMove.target);
                    
                    target.cards.push(currentCard);
                    console.log(target.cards);
                   
                    const sprite = sprites.find((s) => currentCard.face == s.face && currentCard.suit === s.suite);
                    
                    target.addChild(sprite.sprite);

                    flipContainer.removeChild(sprite.sprite);
                   

                } else {
                    let currentField = fields.find(f => f.type == previousMove.source);
                    previousCard = currentField.cards[Number(previousMove.index)];
                    let targetField = fields.find(f => f.type == previousMove.target);
                    let currentSprite = sprites.find(s => previousCard.face === s.face && previousCard.suit === s.suite);
                    //console.log(previousCard, currentField, targetField, currentSprite, previousCard, 'take');
                    console.log(currentField.cards,previousMove, 'take')
                    currentField.removeChild(currentSprite.sprite);
                    currentField.cards.splice(Number(previousMove.index), 1);
                    console.log(currentField.cards, 'take')
                    targetField.addChild(currentSprite.sprite);
                    targetField.cards.push(previousCard);
                    currentSprite.sprite.position.set(0, (targetField.cards.length - 1) * 40 )
                }
            }
        }
    }

    function onMoves(receivedMoves) {
        moves = receivedMoves;
        console.log('received moves', moves);
     
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
