import * as PIXI from "pixi.js";
import { Card } from "../Card";
import { CARD_HEIGHT, CARD_WIDTH, cardNames } from "./constants";

export function createCards(baseTexture: PIXI.BaseTexture, app: PIXI.Application) {
  const cards: Card[] = [];
  let y = 850;
  let power = 0;

  for (let i = 0; i <= 3; i++) {
    let x = 50;
    for (let j = 0; j <= 12; j++) {
      const container = new PIXI.Container();
      container.position.set(0, 0);
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
  return cards;
}

export function renderCards(app: PIXI.Application): Card[] {
  const cardTexture = new PIXI.BaseTexture("/assets/sprite.jpg");
  const cards = createCards(cardTexture, app);
  return cards;
}
