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
import { createCards, createSuitsImages, renderCards } from "./utils/Factory";
import { Card } from "./Card";
import { PixiPlugin } from "gsap/PixiPlugin";
import gsap from "gsap";



gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);


// add canvas
const app = new PIXI.Application({
    background: "0x006E33",
    width: window.innerWidth - 15,
    height: window.innerHeight - 20
});

document.body.appendChild(app.view as HTMLCanvasElement);

async function init() {
    await PIXI.Assets.load("/assets/sprite.jpg");
    await PIXI.Assets.load("/assets/back.png");


}

init().then(start);

async function start() {





    const cards = renderCards();
    const suites = createSuitsImages();


    //create fields
    const field = new GameField(850, 30, 120, 150, suites[0]);
    const field1 = new GameField(1100, 30, 120, 150, suites[1]);
    const field2 = new GameField(1350, 30, 120, 150, suites[2]);
    const field3 = new GameField(1600, 30, 120, 150, suites[3]);

    const fields: PIXI.Container[] = [];

    let x = 100;
    for (let i = 0; i < 7; i++) {

        let initialField = new GameField(x, 300, 120, 150);
        fields.push(initialField);
        app.stage.addChild(initialField);
        x += 250;
    }

    app.stage.addChild(field, field1, field2, field3);
    app.stage.addChild(...cards.map((card) => card.get));

    //  gsap.to(cards, { pixi: { x: 200 }, duration: 1 });

    // app.stage.addChild(suite[30])
}