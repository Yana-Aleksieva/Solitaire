import * as PIXI from "pixi.js";
import { Card } from "./Card";

export class GameField {
  private cards: Card[];

  constructor(public app: PIXI.Application) {
    this.cards = [];
  }

  createFields() {
    console.log("create fields")
    let initial = 900;
    for (let i = 1; i <= 4; i++) {
      const field = new PIXI.Graphics();
      field.beginFill(0, 0.1);
      field.drawRoundedRect(initial, 30, 200, 350, 10);
      field.endFill();
      initial += 245;

      this.app.stage.addChild(field);
    }
  }
}
