import * as PIXI from "pixi.js";

export class GameField {
  constructor(public app: PIXI.Application) {}

  createFields() {
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
