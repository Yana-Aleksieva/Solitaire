import * as PIXI from "pixi.js";
import { Card } from "./Card";
import { createSuitsImages } from "./utils/Factory";
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";




// register the plugin
gsap.registerPlugin(PixiPlugin);

// give the plugin a reference to the PIXI object
PixiPlugin.registerPIXI(PIXI);


export class GameField extends PIXI.Container {

  private cards: Card[];
  private _suite: PIXI.Sprite[];


  constructor() {
    super();
    this.cards = [];
    this._suite = createSuitsImages();

  }

  createFields() {
    console.log("create fields")
    let initial = 900;

    for (let i = 1; i <= 4; i++) {

      const sprite = new PIXI.Sprite();

      // const field = new PIXI.Graphics();
      // field.beginFill(0x006E33, 0.5);
      // field.drawRoundedRect(0, 0, 120, 150, 10);
      // field.endFill();
      const field = this._suite[i];

      this.setFieldImage();


      const border = new PIXI.Graphics();
      border.beginFill(0xFEFCFA);
      border.drawRoundedRect(-4, -3, 150, 200, 10);
      border.endFill();

      sprite.addChild(border, field);
      field.anchor.set(0.5);
      field.position.set(70, 95);

      //this.addMask(field);
      // field.pivot.set(0.5);
      // border.pivot.set(0.5);
      sprite.anchor.set(0.5);
      sprite.position.set(initial, 30);
      initial += 200;


      this.addChild(sprite);
    }
  }

  setSuitesAnchor() {

  }

  setFieldImage() {

    gsap.set(this._suite, { pixi: { tint: 0x427C0C, alpha: 0.4 } });
  }

  addMask(sprite: PIXI.Sprite) {



    const rect = new PIXI.Graphics();

    rect.beginFill(0xfffff);
    rect.drawRoundedRect(0, 0, 150, 180, 10);
    rect.endFill();

    //  s.anchor.set(0.5);
    rect.position.set(sprite.x, sprite.y);
    sprite.mask = rect;
    sprite.addChild(rect);

  }
}
