import * as PIXI from "pixi.js";
import { Card } from "../Card";

export async function cardFactory(spritesheets: PIXI.Spritesheet): Promise<Card[]> {
  return new Promise((resolve, reject) => {
    const frames = spritesheets.data.frames;
    const cards: Card[] = [];
    
    Object.keys(frames).map((name) => {
        const card = new Card(name, spritesheets);
        cards.push(card);
    });

    resolve(cards.slice(0, 1));
  });
}
