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
import { createSuitsImages, renderCards } from "./utils/Factory";
import { gsap, random } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { CARD_WIDTH } from "./utils/constants";
import { field, field1, field2, field3 } from "./utils/gameField";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);
// add canvas
const app = new PIXI.Application({
    background: "0x006E33",
    width: window.innerWidth,
    height: window.innerHeight
});

document.body.appendChild(app.view as HTMLCanvasElement);

async function init() {
    await PIXI.Assets.load("/assets/sprite.jpg");
    await PIXI.Assets.load("/assets/back.png");
}

init().then(start);

async function start() {
    // const field = new GameField(0, 0, 300, 300);
    // field.createField();

    // const cards = renderCards(app);
    // app.stage.addChild(...cards.map((card) => card.get));

    // Dependency Injection ???
    let cards = renderCards(app);
    const suites = createSuitsImages();

    // cards.forEach((card) => {
    //   field.addCard(card.sprite);
    // })
    //create fields
    // const field = new GameField(850, 30, 120, 150, "H", suites[0]); // hearts
    // const field1 = new GameField(1100, 30, 120, 150,"S", suites[1]); // spades
    // const field2 = new GameField(1350, 30, 120, 150,"D", suites[2]); // diamond
    // const field3 = new GameField(1600, 30, 120, 150,"C", suites[3]); // club

    //field.addCard(cards[0]);
    //field.addCard(cards[1].sprite);

    console.log(field.getCards())
    const fields: PIXI.Container[] = [];

    let x = 100;
    for (let i = 0; i < 7; i++) {
        let initialField = new GameField(x, 400, 120, 150);
        fields.push(initialField);
        app.stage.addChild(initialField);
        x += 250;
    }

    app.stage.addChild(field, field1, field2, field3, ...cards.map((card) => card.get));
    const tl = gsap.timeline();
    const cardsContainers = cards.map((card) => card.get);

    // tl.to(cardsContainers,
    //     {
    //         pixi: {

    //             x: 300,
    //             y: 100
    //         },
    //         duration: 0.1,
    //         repeat: 0,
    //         delay: 1,
    //         stagger: {
    //             each: 0.1,
    //             from: 'random',

    //         },
    //     });
    // tl.to(cardsContainers,
    //     {
    //         pixi: {

    //             x: 100,
    //             y: 100
    //         },
    //         duration: 0.1,
    //         repeat: 0,
    //         ease: "power2.inOut",
    //         stagger: {
    //             each: 0.1,
    //             from: 'random',
    //         }
    //     }, '>');

    // // card animation to initial fields

    // let index = 0;
    // let positionIndex = 0;

    // for (let i = 0; i < 7; i++) {
    //     let fieldIndex = 100 + i * 250;

    //     for (let j = i; j < 7; j++) {
    //         const f = fields[j];

    //         const card = cardsContainers[cardsContainers.length - index - 1];
    //         const cardContainer = cards[cards.length - index - 1]
    //         tl.to(card,
    //             {
    //                 pixi: { x: f.x, y: f.y + positionIndex },
    //                 duration: 0.3,
    //                 ease: "power2.inOut",
    //                 onComplete: () => {
    //                     f.addChild(card);
    //                     card.position.x = 70;
    //                     card.position.y -= 320;
    //                     if (j == i) {
    //                         cardContainer.flip();
    //                         //cardContainer.isActive = true;
    //                     }
    //                 }
    //             }, '>');
          
    //         index++;
    //         fieldIndex += 250;
    //     }
    //     positionIndex += 40;
    // }
}