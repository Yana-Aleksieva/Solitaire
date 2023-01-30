import * as PIXI from "pixi.js";
import { Card } from "../Card";
import gsap from "gsap";
import { CARD_HEIGHT, CARD_WIDTH, cardNames } from "./constants";

export function createCards(baseTexture: PIXI.BaseTexture, app: PIXI.Application) {
  const cards: Card[] = [];
  let y = 850;
  let power = 0;

  for (let i = 0; i <= 3; i++) {
    let x = 50;
    for (let j = 0; j <= 12; j++) {
      const container = new PIXI.Container();
      container.position.set(100, 100);

      const texture = new PIXI.Texture(baseTexture, new PIXI.Rectangle(x, y, 400, 620));
      const spriteCard = new PIXI.Sprite(texture);
      
      spriteCard.width = CARD_WIDTH;
      spriteCard.height = CARD_HEIGHT;

      //create mask
      const rect = new PIXI.Graphics();
      rect.beginFill(0x00000);
      rect.drawRoundedRect(spriteCard.position.x, spriteCard.position.y, CARD_WIDTH, CARD_HEIGHT, 10);
      rect.endFill();

      spriteCard.mask = rect;
      container.addChild(spriteCard, rect);

      // Add card name
      const card = new Card(cardNames[i][j], container, power, app);
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
    let randomIndex = Math.floor(Math.random() * (i + 1))
    let temp = cards[i]
    cards[i] = cards[randomIndex]
    cards[randomIndex] = temp;
  }
}

export function renderCards(app: PIXI.Application): Card[] {
  const cardTexture = new PIXI.BaseTexture("/assets/sprite.jpg");
  const cards = createCards(cardTexture, app);
  return cards;
}

export function createSuitsImages() {
  const cardTexture = new PIXI.BaseTexture("/assets/sprite.jpg");
  const suite: PIXI.Sprite[] = [];
  let x = 50;

  for (let i = 0; i < 32; i++) {
    const texture = new PIXI.Texture(cardTexture, new PIXI.Rectangle(x, 3640, 185, 180));
    const spriteCard = new PIXI.Sprite(texture);
    // spriteCard.position.set(0, 0);
    spriteCard.width = 140;
    spriteCard.height = 180;
    //
    suite.push(spriteCard);
    x += 185;
  }
  return suite;
}

