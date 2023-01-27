import * as PIXI from "pixi.js";
import { Card } from "../Card";

export function createCards(baseTexture: PIXI.BaseTexture) {
  const cards: Card[] = [];
  let y = 850;

  for (let i = 0; i <= 3; i++) {
    let x = 50;
    for (let j = 0; j <= 12; j++) {
      const container = new PIXI.Container();
      const texture = new PIXI.Texture(baseTexture, new PIXI.Rectangle(x, y, 400, 620));
      const spriteCard = new PIXI.Sprite(texture);

      spriteCard.width = 120;
      spriteCard.height = 150;

      //create mask
      const rect = new PIXI.Graphics();
      rect.beginFill(0x00000);
      rect.drawRoundedRect(spriteCard.position.x, spriteCard.position.y, 120, 150, 10);
      rect.endFill();

      spriteCard.mask = rect;
      container.addChild(spriteCard, rect);
      const card = new Card("", container);
      cards.push(card);
      x += 458;
    }
    y += 660;
  }
  return cards;
}

export function renderCards(): Card[] {
  const cardTexture = new PIXI.BaseTexture("/assets/sprite.jpg");
  const cards = createCards(cardTexture);

 // cards[0].position = 60;
  return cards;
}
