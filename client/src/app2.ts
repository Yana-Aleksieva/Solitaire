import { Connection } from "./websocket/Connection";
// import { engine } from "./engine";
import * as PIXI from "pixi.js";

const app = new PIXI.Application<HTMLCanvasElement>({
    width: window.innerWidth - 20,
    height: window.innerHeight - 20
});
document.body.appendChild(app.view);

// 50 - 505 - 960
// += 455 
const card = new PIXI.BaseTexture("/assets/sprite.jpg");
const clubTextureA = new PIXI.Texture(card, new PIXI.Rectangle(50, 850, 400, 620));
const clubSprite = new PIXI.Sprite(clubTextureA);
clubSprite.width = 120;
clubSprite.height = 150;

const clubTextureTwo = new PIXI.Texture(card, new PIXI.Rectangle(505, 850, 400, 620));
const clubSpriteTwo = new PIXI.Sprite(clubTextureTwo);
clubSpriteTwo.width = 120;
clubSpriteTwo.height = 150;

const clubTextureThree = new PIXI.Texture(card, new PIXI.Rectangle(960, 850, 400, 620));
const clubSpriteThree = new PIXI.Sprite(clubTextureThree);
clubSpriteThree.width = 120;
clubSpriteThree.height = 150;

clubSprite.position.set(10, 10);
clubSpriteTwo.position.set(150, 10);
clubSpriteThree.position.set(290, 10);

app.stage.addChild(clubSprite);
app.stage.addChild(clubSpriteTwo);
app.stage.addChild(clubSpriteThree);

// const initForm = document.querySelector('form');
// const initSection = document.getElementById('init');
// const gameSection = document.getElementById('game');

// let connection = null;

// initForm.addEventListener('submit', async event => {
//     event.preventDefault();
//     const { nickname } = Object.fromEntries(new FormData(event.target as HTMLFormElement));

//     // connection = new Connection(nickname as string);
//     // await connection.open();
//     // engine(connection);
//     showBoard();

//     // connection.send('startGame');
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