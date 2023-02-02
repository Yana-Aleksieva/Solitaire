// import { Connection } from "./Connection";
// import { engine } from "./engine";

// const initForm = document.querySelector('form');
// const initSection = document.getElementById('init');
// const gameSection = document.getElementById('game');

// let connection = null;

// initForm.addEventListener('submit', async event => {
//     event.preventDefault();
//     const { nickname } = Object.fromEntries(new FormData(event.target as HTMLFormElement));

//     connection = new Connection(nickname as string);
//     await connection.open();
//     engine(connection);
//     showBoard();

//     connection.send('startGame');
// });

// document.getElementById('disconnect').addEventListener('click', () => {
//     connection?.disconnect();
//     showInit();
// });

// function showBoard() {
//     initSection.style.display = 'none';
//     gameSection.style.display = 'block';
// }

// function showInit() {
//     initSection.style.display = 'block';
//     gameSection.style.display = 'none';
// }


// import { Connection } from "./Connection";
// import { engine } from "./engine";

import * as PIXI from "pixi.js";
import { GameField } from "./GameFields";
import { addCardInGameField, createSuitsImages, deal, renderCards } from "./utils/Factory";
import { gsap, random } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { CARD_HEIGHT, CARD_WIDTH } from "./utils/constants";
import { field, field1, field2, field3 } from "./utils/gameField";
import { Tank } from "./Tank";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);
// add canvas
const app = new PIXI.Application({
    background: "0x006E33",
    width: window.innerWidth,
    height: window.innerHeight
});

document.body.appendChild(app.view as HTMLCanvasElement);


// Dependency Injection ???
let cards = renderCards(app);
const suites = createSuitsImages();
const fields: GameField[] = [];
//add container to position 100:100
// const container = new Tank(100, 100, onClick.bind(null));
const container = new Tank(100, 100);
//flip container
//const flipContainer = new Tank(300, 100, onMove.bind(null));
const flipContainer = new Tank(300, 100,);
const tl = gsap.timeline();


async function init() {
    await PIXI.Assets.load("/assets/sprite.jpg");
    await PIXI.Assets.load("/assets/back.png");
}

init().then(start).then(
    function deal() {
        tl.to(cards,
            {
                pixi: {

                    x: 300,
                    y: 100
                },
                duration: 0.1,
                repeat: 0,
                delay: 1,
                stagger: {
                    each: 0.1,
                    from: 'random',

                },
            });

        +       tl.to(cards,
            {
                pixi: {

                    x: 100,
                    y: 100
                },
                duration: 0.1,
                repeat: 0,
                ease: "power2.inOut",
                stagger: {
                    each: 0.1,
                    from: 'random',
                }
            }, '>');

      //  card animation to initial fields

        let index = 0;
        let positionIndex = 0;

        for (let i = 0; i < 7; i++) {
            let fieldIndex = 100 + i * 250;

            for (let j = i; j < 7; j++) {
                const f: GameField = fields[j];

                const card = cards[cards.length - index - 1];
                const cardContainer = cards[cards.length - index - 1]
                tl.to(card,
                    {
                        pixi: { x: f.x, y: f.y + positionIndex },
                        duration: 0.3,
                        ease: "power2.inOut",
                        onComplete: () => {
                            f.addChild(card);
                            //f.addCard(card)
                            f.addCard(card);
                            container.remove(card);
                            card.position.x = 70;
                            card.position.y -= 320;
                            if (j == i) {
                                // console.log(cardContainer
                                //     )
                                card.flip();
                                card.isActive = true;

                            }
                        }
                    }, '>').then(() => tl.pause());

                index++;
                fieldIndex += 250;
            }
            positionIndex += 40;
        }

    })

async function start() {


    let x = 100;
    for (let i = 0; i < 7; i++) {
        let initialField = new GameField(x, 400, 120, 150);
        fields.push(initialField);

        app.stage.addChild(initialField);
        x += 250;
    }

    app.stage.addChild(field, field1, field2, field3, container, flipContainer);

    // const cardsContainers = cards.map((card) => card.get);
    cards.forEach(c => {
        container.add(c);
        //container.push(c);
    })
    // container.addChild(...cards);




}
function onClick() {

    const current = container.cards[container.cards.length - 1];
    container.remove(current)
    flipContainer.add(current);
}

function onMove() {
    console.log('pointertap')
    let currentCard = flipContainer.cards[flipContainer.cards.length - 1];
    for (let i = 0; i < 7; i++) {
        let field = fields[i];
        //field.removeCard()
        const cardOnField = field.getLastCard()
        console.log(field.getLastCard().color);
        console.log(currentCard.power, cardOnField.power);
        if (currentCard.power + 1 == cardOnField.power
            && currentCard.color != cardOnField.color) {
            flipContainer.remove(currentCard);
            field.addChild(currentCard);
            field.addCard(currentCard);
            currentCard.setPosition(field.getLastCard().x - CARD_WIDTH / 2, field.getLastCard().y + CARD_HEIGHT / 2)
        }
    }
}

