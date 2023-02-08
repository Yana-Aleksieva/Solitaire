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

    connection.on('state', onStart);
    //connection.on('moves', onMoves);
    connection.on('moveResult', onResult);
    //  connection.on('victory', onVictory);
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
        const flipContainer = new GameField(-1, WINDOW_WIDTH / 7 * 2 - 210, 70, []);
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
            let sprites = createSprites();
            
            // render cards
            container.cards.forEach((card) => {
                const back: PIXI.Sprite = new PIXI.Sprite(
                    new PIXI.Texture(new PIXI.BaseTexture("/assets/back.png"))
                );
                back.width = CARD_WIDTH;
                back.height = CARD_HEIGHT;
                container.addChild(back);
            })

           
            fields = getFields(data.piles);
            console.log(fields);
            fields.forEach((field) => {
                let bottomPositon = 0;
                field.cards.forEach((card, i) => {
                    console.log(card);
                    if (!card.face) {
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
                        console.log(currentCard);
                        field.addChild(currentCard.sprite);
                    }
                    bottomPositon += 40;
                })
            })

            let score = new TextArea("Score: 0");
            let time = new TextArea("Time: 0.0");
            // fields.forEach(f => {
            //     let card = f.cards[f.cards.length - 1];

            //     let face = cards.find(c =>
            //         c.suite === card.suit && c.power === card.face
            //     );
            //     f.addChild(face);
            //     face.position.set(CARD_WIDTH, CARD_HEIGHT);
            //     face.flip();

            // });

            // sprites.forEach(c => {
            //     container.addChild(c);
            // });

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
                //console.log("click")
                //console.log('container');
                const action = 'flip';
                const type = 'stock';
                let currentCard = container.cards[container.cards.length - 1];
                //console.log(currentCard);
                if (true) {
                   // console.log(currentCard);
                    data.stock.cards[data.stock.cards.length - 1].faceUp = true;
                    console.log(data.stock.cards[data.stock.cards.length - 1])
                    move = {
                        action,
                        source: type,
                        target: null,
                        index: 20
                    };
                    console.log(connection);
                    connection.send('move', move);
                    // connection.send('moves', data);
                    // connection.on('moves', onMove)
                    //connection.on('send', )
                    // const tempContainer = new PIXI.Container();
                    // container.rem(currentCard);
                    // tempContainer.addChild(currentCard);
                    // // tempContainer.pivot.set(CARD_WIDTH / 2, CARD_HEIGHT / 2);
                    // tempContainer.position.set(container.x, container.y)
                    // app.stage.addChild(tempContainer);
                    // moveCard(tempContainer, flipContainer, currentCard);
                    // currentCard.flip();
                    // tempContainer.removeChild(currentCard);
                    // flipContainer.addChild(currentCard);
                    // flipContainer.add(currentCard);
                    // currentCard.position.set(CARD_WIDTH, CARD_HEIGHT);
                    // app.stage.removeChild(tempContainer);
                    // console.log(flipContainer.cards)

                }

            });

        }

        function onClick() {
            // const current = container.cards[container.cards.length - 1];
            // container.remove(current);
            // current.onStart = true;
            // flipContainer.add(current);
            // current._parent = flipContainer
        }

        function onMove(moves) {
            console.log(moves);
        }
    }

    function onMoves(receivedMoves) {
        moves = receivedMoves;
        console.log('received moves', moves);
        //  mergeMoves();
    }


    function onResult(data){

        console.log(data)
    }

}