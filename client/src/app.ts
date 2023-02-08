import { Connection } from "./websocket/Connection";
import * as PIXI from "pixi.js";
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { GameField } from "./GameFields";
import {
  addCardInGameField,
  createSuitsImages,
  getFields,
  createCards,
  fillPiles,
} from "./utils/Factory";
import { field, field1, field2, field3 } from "./utils/gameField";
import { Tank } from "./Tank";
import { TextArea } from "./utils/TextArea";
import { WINDOW_HEIGHT, WINDOW_WIDTH } from "./utils/constants";
import { dealCards, shuffleCards } from "./animations";
import { State } from "pixi.js";
import { Card } from "./Card";
import { engine } from "./websocket/engine"

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

const initForm = document.querySelector("form");
const initSection = document.getElementById("init");
const gameSection = document.getElementById("game");

let connection = null;

initForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const { nickname } = Object.fromEntries(
    new FormData(event.target as HTMLFormElement)
  );

  connection = new Connection(nickname as string);
  await connection.open();
  engine(connection);
  showBoard();
  connection.send("startGame");
});

document.getElementById("disconnect").addEventListener("click", () => {
  connection?.disconnect();
  showInit();
});

function showBoard() {
  initSection.style.display = "none";
  //gameSection.style.display = 'block';
  
}

function showInit() {
  initSection.style.display = "block";
  gameSection.style.display = "none";
}

// add canvas
const app = new PIXI.Application({
  background: "0x006E33",
  width: window.innerWidth,
  height: window.innerHeight,
});

// function onStart(data) {
//   console.log(data);
//   document.body.appendChild(app.view as HTMLCanvasElement);
//   // Dependency Injection ???
//   const container = new Tank(100, 100, data.stock.cards);
//   //let cards = renderCards(app, container);
//   const piles = data.piles;
//   const suites = createSuitsImages();
//   let fields: GameField[] = [];
//   const flipContainer = new Tank(300, 100, []);
//   async function init() {
//     await PIXI.Assets.load("/assets/sprite.jpg");
//     await PIXI.Assets.load("/assets/back.png");
//   }

//   init().then(start);
//   // .then(() => shuffleCards(cards))
//   //.then(() => dealCards(cards, fields, app))

//   async function start() {
//     // create cards
//     let cards = createCards(app);

//     // render cards
//     cards.forEach((c) => {
//       c.position.set(100, 150);
//       container.add(c);
//     });

//     fields = getFields(data.piles);
//     let score = new TextArea("Score: 0");
//     let time = new TextArea("Time: 0.0");

//     // render fields
//     let finishFillFields = true;
//     const tl = gsap.timeline();
//     fields.forEach((f) => {
//       let bottomSpace = 180;
//       f.cards.forEach((card, i) => {
//         let offset = i * 250;
//         finishFillFields = false;
//         const currentCard = cards.find(
//           (c) => c.face == card.face && c.suite == card.suit
//         );

//         // tl.to(
//         //   currentCard,
//         //   {
//         //     pixi: { x: f.x + card.width, y: 470 },
//         //     duration: 0.3,
//         //     onComplete: () => {
//         //       app.stage.addChild(card);
//         //       card.onStart = false;
//         //       card._parent = f;

//         //       if (card.faceUp) {
//         //         card.flip();
//         //       }
//         //     },
//         //     ease: "sine.inOut",
//         //   },
//         //   ">"
//         // ).then(() => {
//         //   tl.kill();
//         // });
//         currentCard.position.set(140, bottomSpace);
//         f.addChild(currentCard);
//         bottomSpace += 40;

//         if (card.faceUp) {
//           currentCard.flip();
//         }
//       });
//       finishFillFields = true;
//     });

//     if (finishFillFields) {
//       //dealCards(cards, fields, app);
//     }

//     //app.stage.addChild(first);
//     //const searchCard = cards.find((c) => c.suite = "")
//     app.stage.addChild(
//       field,
//       field1,
//       field2,
//       field3,
//       ...fields,
//       container,
//       flipContainer,
//       score,
//       time
//     );
//     score.position.set(WINDOW_WIDTH - 300, 30);
//     time.position.set(WINDOW_WIDTH - 100, 30);
//   }

//   function onClick() {
//     // const current = container.cards[container.cards.length - 1];
//     // container.remove(current);
//     // current.onStart = true;
//     // flipContainer.add(current);
//     // current._parent = flipContainer
//   }

//   function onMove() {}
// }
