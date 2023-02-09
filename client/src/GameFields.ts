import * as PIXI from "pixi.js";
import { Card } from "./Card";
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { CARD_HEIGHT, CARD_WIDTH } from "./utils/constants";


gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export class GameField extends PIXI.Container {
  cards = [];
  private _suite: string;
  private _border: PIXI.Graphics;
  private _position: { x: number; y: number };
  private _image: PIXI.Sprite;
  private _imageContainer: PIXI.Container;
type: string
  constructor(
    public id: number,
    x: number,
    y: number,
    piles: [],
    type: 'pile'| 'foundation'| 'flip',
    suite?: string,
    image?: PIXI.Sprite
  ) {
    super();
    this.cards = piles;
    this._suite = suite;
    this._image = image;

    (this.position.x = x),
      (this.position.y = y),
      this.createField();
    this.interactive = true;

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
    this._border.drawRoundedRect(0, 0, CARD_WIDTH, CARD_HEIGHT, 10);
    this._border.endFill();

  }

  createField() {

    this.setBorder();
    if (this._image !== undefined) {
      this._image.anchor.set(0.5);
      this._image.width = CARD_WIDTH - 5;
      this._image.height = CARD_HEIGHT - 5;
      this.setFieldBackground(this._image);
      this.addMask(this._image);

    } else {
      this.setBackground();
    }

  }

  setBackground() {
    this.setBorder();
    const container = new PIXI.Container();
    const rect = new PIXI.Graphics();
    rect.beginFill(0x006E33, 1);
    rect.drawRoundedRect(0, 0, CARD_WIDTH - 5, CARD_HEIGHT - 5, 10);
    rect.endFill();
    rect.position.set(2.5, 2.5);
    container.addChild(this._border, rect);
    this.addChild(container);
  }

  setFieldBackground(image: PIXI.Graphics | PIXI.Sprite) {
    const tl = gsap.timeline();
    tl.set(image, { pixi: { tint: 0x427c0c, alpha: 0.4 } }).then(() =>
      tl.pause()
    );
  }

  addMask(sprite: PIXI.Sprite) {

    const rect = new PIXI.Graphics();
    rect.beginFill(0xfffff);
    rect.drawRoundedRect(0, 0, sprite.width, sprite.height, 10);
    rect.endFill();
    sprite.anchor.set(0.5)
    rect.pivot.set(sprite.width / 2, sprite.height / 2)
    rect.position.set(this._border.width / 2, this._border.height / 2);
    sprite.position.set(this._border.width / 2, this._border.height / 2);
    const container = new PIXI.Container();
    this.setBorder();
    container.addChild(this._border, sprite, rect);
    sprite.mask = rect;

    this.addChild(container);

  }

  renderCards() {
    this.cards.forEach((card) => {
      const spriteCard = new PIXI.Sprite(card.sprite.texture);
      spriteCard.width = CARD_WIDTH;
      spriteCard.height = CARD_HEIGHT;
      this._imageContainer.addChild(spriteCard);
    });
  }

  addCard(card: Card) {
    if (this.cards.length == 0 && card.face == 1) {
      this.cards.push(card);
      this.renderCards();
    }

    const lastCard = this.cards[this.cards.length - 1];
    if (!this.cards.some((c) => c.name == card.name && card.power > c.power)) {
      this.cards.push(card);
      this.renderCards();
    }
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


