import * as PIXI from "pixi.js";
import { Card } from "./Card";
import { createSuitsImages } from "./utils/Factory";
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { Container } from "pixi.js";

//const suite = createSuitsImages();

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export class GameField extends PIXI.Container {
  private cards: Card[] = [];
  private _suite: string;
  private _border: PIXI.Graphics;
  private _position: { x: number; y: number };
  private _image: PIXI.Sprite;

  private _imageContainer: PIXI.Container;
  private data = null;
  private _dragging = false;
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    suite?: string,
    image?: PIXI.Sprite
  ) {
    super();
    this.cards = [];
    this._suite = suite;
    this._image = image;
    (this.width = width),
      (this.height = height),
      (this.position.x = x),
      (this.position.y = y),
      this.createField();



      this._imageContainer = new PIXI.Container();
      this.addChild(this._imageContainer);
      //this.on("pointerdown", () => {console.log("click")})
  }

  get suite() {
    return this._suite;
  }

  getCards() {
    return this.cards;
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
      //sprite.zIndex = -1;
    } else {
      this.setBackground(sprite);
    }
    sprite.anchor.set(0.5);
    this.addChild(sprite);
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
    const tl = gsap.timeline();
    tl.set(image, { pixi: { tint: 0x427c0c, alpha: 0.4 } }).then(() => tl.pause());
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

  renderCards() {
    this.cards.forEach((card) => {
      const spriteCard = new PIXI.Sprite(card.sprite.texture);
      spriteCard.width = 160;
      spriteCard.height = 200;
      this._imageContainer.addChild(spriteCard);
    });
  }

  addCard(card: Card) {
    if (this.cards.length == 0 && card.name.concat("A")) {
      this.cards.push(card);
    } else {
      if (!this.cards.some((c) => c.name == card.name && c.power > card.power)) {
        this.cards.push(card);
      }
    }
    this.renderCards();
  }

  removeCard(card: Card) {
    let index = this.cards.indexOf(card);
    if (index != -1) {
      this.cards.splice(index, 1);
    }
  }

  getLastCard() {
    return this.cards[this.cards.length - 1];
  }
  add(card: Card) {
    this.cards.push(card);
  }

}


