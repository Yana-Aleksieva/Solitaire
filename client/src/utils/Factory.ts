import * as PIXI from "pixi.js";
import { Card } from "../Card";
import { CARD_HEIGHT, CARD_WIDTH, cardNames, names, WINDOW_HEIGHT, WINDOW_WIDTH } from "./constants";
import { GameField } from "../GameFields";
import { Tank } from "../Tank";

export function createSprites() {
  const baseTexture = new PIXI.BaseTexture("/assets/sprite.jpg");
  const sprites = [];
  let y = 850;
  let suites = ["spades", "hearts", "clubs", "diamonds"];

  for (let i = 0; i <= 3; i++) {
    let x = 50;
    let power = 0;
    let suite = suites[i];
    for (let j = 0; j <= 12; j++) {
      const texture = new PIXI.Texture(
        baseTexture,
        new PIXI.Rectangle(x, y, 400, 620)
      );
      const _back: PIXI.Sprite = new PIXI.Sprite(
        new PIXI.Texture(new PIXI.BaseTexture("/assets/back.png"))
      );
      const spriteCard = new PIXI.Sprite(texture);
      spriteCard.width = CARD_WIDTH;
      spriteCard.height = CARD_HEIGHT;
      const container = addMask(spriteCard)
      sprites.push({ face: names[j], suite: suites[i], sprite: container });
      const newCard = new Card();
      power++;
      //sprites.push(spriteCard);
      x += 458;
    }
    y += 660;
  }

  return sprites;
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

export function getFields(data, c?: () => void): GameField[] {
  let arr = [];
  const offsetX = WINDOW_WIDTH / 7;
  const offsetY = WINDOW_HEIGHT / 2.5;
  let x = 50;
  let fieldId = 5;
  for (let i = 0; i < 7; i++) {
    const initialField = new GameField(fieldId++, x, offsetY, data[i].cards, `pile${i}`);
    arr.push(initialField);
    x += offsetX;
  }
  return arr;
}

function addMask(sprite: PIXI.Sprite) {

  const container = new PIXI.Container();

  const rect = new PIXI.Graphics();
  rect.beginFill(0xfffff);
  rect.drawRoundedRect(0, 0, CARD_WIDTH, CARD_HEIGHT, 10);
  rect.endFill();
  rect.pivot.set(CARD_WIDTH / 2, CARD_HEIGHT / 2)
  rect.position.set(CARD_WIDTH / 2, CARD_HEIGHT / 2);
  sprite.mask = rect;
  container.addChild(sprite, rect);
  return container;
}
export function fillPiles() {

}

