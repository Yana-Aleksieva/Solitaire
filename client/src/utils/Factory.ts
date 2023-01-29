import * as PIXI from "pixi.js";
import { Card } from "../Card";
import { CARD_HEIGHT, CARD_WIDTH, cardNames } from "./constants";

export function createCards(baseTexture: PIXI.BaseTexture) {
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

      const tempCardContainer = new PIXI.Container();

      // Add card name
      const card = new Card(cardNames[i][j], container, power, tempCardContainer);
      cards.push(card);

      const tempCard = new PIXI.Graphics();
      tempCard.beginFill(0.5);
      tempCard.drawRect(0, 0, 240, 340);
      tempCard.endFill();

      tempCard.addChild(card);

      tempCardContainer.addChild(tempCard, card);
      tempCardContainer.position.set(300, 10);

      container.addChild(tempCardContainer);

      x += 458;
      power++;
    }
    y += 660;
  }
  return cards;
}

export function renderCards(): Card[] {
  const cardTexture = new PIXI.BaseTexture("/assets/sprite.jpg");
  const cards = createCards(cardTexture);
  return cards;
}
