import * as PIXI from "pixi.js";
import { Card } from "../Card";
import { CARD_HEIGHT, CARD_WIDTH, cardNames, names, WINDOW_HEIGHT, WINDOW_WIDTH } from "./constants";
import { GameField } from "../GameFields";
import { Tank } from "../Tank";

export function createCards(
  app: PIXI.Application,
  onClick
): Card[] {
  const baseTexture = new PIXI.BaseTexture("/assets/sprite.jpg");
  const cards: Card[] = [];
  let y = 850;
  let suites = ["clubs", "hearts", "spades", "diamonds"];

  for (let i = 0; i <= 3; i++) {
    let x = 50;
    let power = 1;
    let suite = suites[i];
    for (let j = 0; j <= 12; j++) {
      // const container = new PIXI.Container();
      // container.position.set(100, 100);

      const texture = new PIXI.Texture(
        baseTexture,
        new PIXI.Rectangle(x, y, 400, 620)
      );
      const spriteCard = new PIXI.Sprite(texture);

      spriteCard.width = CARD_WIDTH;
      spriteCard.height = CARD_HEIGHT;

      const card = new Card(
        j + 1,
        power,
        spriteCard,
        suite,
        onClick,
        app
      );

      cards.push(card);
      x += 458;
      power++;
    }
    y += 660;
  }

  shuffleCards(cards);
  return cards;
}

function shuffleCards(cards: Card[]) {
  for (let i = cards.length - 1; i > 0; i -= 1) {
    let randomIndex = Math.floor(Math.random() * (i + 1));
    let temp = cards[i];
    cards[i] = cards[randomIndex];
    cards[randomIndex] = temp;
  }
}

export function createSuitsImages() {
  const cardTexture = new PIXI.BaseTexture("/assets/sprite.jpg");
  const suite: PIXI.Sprite[] = [];
  let x = 50;

  for (let i = 0; i < 32; i++) {
    const texture = new PIXI.Texture(
      cardTexture,
      new PIXI.Rectangle(x, 3640, 185, 180)
    );
    const spriteCard = new PIXI.Sprite(texture);
    suite.push(spriteCard);
    x += 185;
  }
  return suite;
}

export function addCardInGameField(gameField: GameField, card: Card) {
  const cards = gameField.getCards();

  if (cards.length == 0) {
    if (card.face != 1) {
      return false;
    }
    if (gameField.suite == card.suite) {
      gameField.addCard(card);

      return true;
    }
    return false;
  }

  const lastCard = cards[cards.length - 1];
  if (lastCard.power == card.power - 1 && gameField.suite == card.suite) {
    gameField.addCard(card);
    //console.log(gameField.getCards());
  } else {
    return false;
  }
  return true;
}

export function moveCardFromMainDeckToFlipDeck(
  card,
  flipContainer: Tank
) {
  flipContainer.addChild(card);
}

export function getFields(data): GameField[] {
  let arr = [];
  const offsetX = WINDOW_WIDTH / 7;
  const offsetY = WINDOW_HEIGHT / 2.5;
  let x = 50;
  let fieldId = 5;
  for (let i = 0; i < 7; i++) {
    const initialField = new GameField(fieldId++, x, offsetY, data[i].cards);
    arr.push(initialField);
    x += offsetX;
  }
  return arr;
}

export function fillPiles() {

}

