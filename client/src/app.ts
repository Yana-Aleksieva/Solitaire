import { Connection } from "./websocket/Connection";
import * as PIXI from "pixi.js";
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { GameField } from "./GameFields";
import {
  addCardInGameField,
  createSuitsImages,
  getFields,
  createSprites,
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
  //new Engine(connection);
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
