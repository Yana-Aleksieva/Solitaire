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
import { createCards, renderCards } from "./utils/Factory";
import { Card } from "./Card";
import { PixiPlugin } from "gsap/PixiPlugin";
import gsap from "gsap";


// register the plugin
gsap.registerPlugin(PixiPlugin);

// give the plugin a reference to the PIXI object
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
    const field = new GameField();
    app.stage.addChild(field);
    field.createFields();

    const cards = renderCards();
    app.stage.addChild(...cards.map((card) => card.get));

    
   // app.stage.addChild(suite[30])
}