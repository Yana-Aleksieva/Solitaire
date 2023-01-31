import * as PIXI from "pixi.js";
import { Card } from "./Card";
import { createSuitsImages } from "./utils/Factory";
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";

const suite = createSuitsImages();

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export class GameField extends PIXI.Container {
  private cards: Card[];
  private _suite: PIXI.Sprite[];
  private _border: PIXI.Graphics;
  private _position: { x: number; y: number };
  private _image: PIXI.Sprite;
  private _currentSuite: string;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    currentSuite: string,
    image?: PIXI.Sprite
  ) {
    super();
    this.cards = [];
    this._suite = suite;
    this._currentSuite = currentSuite;
    this._image = image;
    (this.width = width),
      (this.height = height),
      (this.position.x = x),
      (this.position.y = y),
      this.createField();
  }

  setBorder() {
    this._border = new PIXI.Graphics();
    this._border.beginFill(0xfefcfa);
    this._border.drawRoundedRect(-4, -3, 150, 200, 10);
    this._border.endFill();
    this.addChild(this._border);
  }

  createField() {
    this.setBorder();
    const sprite = new PIXI.Sprite();

    if (this._image !== undefined) {
      this.setFieldBackground(this._image);
      this._image.anchor.set(0.5);
      this._image.position.set(70, 95);
      this.addMask(this._image);
      sprite.addChild(this._image);
    } else {
      this.setBackground(sprite);
    }
    sprite.anchor.set(0.5);
    this.addChild(sprite);
    console.log(this._currentSuite)
  }

  private createFields() {
    let initial = 900;
    for (let i = 1; i <= 4; i++) {
      const field = new PIXI.Graphics();
      field.beginFill(0, 0.1);
      field.drawRoundedRect(initial, 30, 200, 350, 10);
      field.endFill();
      initial += 245;
      //this.app.stage.addChild(field);
    }
  }

  setBackground(parent: PIXI.Sprite) {
    const rect = new PIXI.Graphics();
    rect.beginFill(0x588c27);
    rect.drawRoundedRect(0, 0, 140, 190, 10);
    rect.endFill();

    this.setFieldBackground(rect);
    parent.addChild(rect);
  }

  setFieldBackground(image: PIXI.Graphics | PIXI.Sprite) {
    gsap.set(image, { pixi: { tint: 0x427c0c, alpha: 0.4 } });
  }

  addMask(sprite: PIXI.Sprite) {
    const rect = new PIXI.Graphics();

    rect.beginFill(0xfffff);
    rect.drawRoundedRect(0, 0, 180, 180, 10);
    rect.endFill();

    rect.position.set(-90, -90);
    sprite.mask = rect;
    sprite.addChild(rect);
  }

  addCard(card: Card) {
    if (this.cards.length == 0) {
      this.cards.push(card);
    } else {
      const lastCard = this.cards[this.cards.length - 1];
      if (card.power > lastCard.power) {
        this.cards.push(card);
      } else {
      }
    }
  }
}
