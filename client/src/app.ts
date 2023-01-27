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



// add canvas 
import { Connection } from "./Connection";
import { engine } from "./engine";
import * as PIXI from "pixi.js";
import { createCards } from "./util";

const app = new PIXI.Application<HTMLCanvasElement>({
    width: window.innerWidth - 20,
    height: window.innerHeight - 20, backgroundColor: 0x006E33
});
document.body.appendChild(app.view);

// 50 - 505 - 960
// += 455 
const card = new PIXI.BaseTexture("/assets/sprite.jpg");



const cards = createCards(card);



cards[35].position.set(150,100)
app.stage.addChild(cards[35]);

//app.stage.addChild(clubSpriteTwo);
//app.stage.addChild(clubSpriteThree);