import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { CARD_HEIGHT, CARD_WIDTH } from "./utils/constants";
import { addCardInGameField, getFields } from "./utils/Factory";
import { field, field1, field2, field3 } from "./utils/gameField";
import { SuitCard } from "./utils/types";
import { Tank } from "./Tank";
import { GameField } from "./GameFields";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export class Card extends PIXI.Container {
  private _name: number;
  private _container: PIXI.Container;
  _color: SuitCard;
  _power: number;
  _parent: GameField | Tank;
  onStart: boolean = true;
  private _dragging: boolean;
  private _position: { x: number; y: number };
  private _back: PIXI.Sprite = new PIXI.Sprite(
    new PIXI.Texture(new PIXI.BaseTexture("/assets/back.png"))
  );
  isActive: boolean = false;
  private _face: PIXI.Sprite;
  private _suite: string;
  private _cardContainer: Tank;
  public fields: GameField[];

  constructor(
  ) {
    super();
    this.interactive = true;
    //this._name = name;
    //this._power = power;
    this.fields = [];
    this._container = new PIXI.Container();
    this.pivot.set(CARD_WIDTH / 2, CARD_HEIGHT / 2);
    this._dragging = false;
    //this._face = sprite;

    this._back.anchor.set(0.5);
    this._back.width = CARD_WIDTH;
    this._back.height = CARD_HEIGHT;
    this.addChild(this._back);
    this.interactive = true;
   // this.addMask();
  }

 
  get sprite(): PIXI.Sprite {
    return this._face;
  }

  get suite() {
    return this._suite;
  }

  get color() {
    let suite = this._suite.substring(0);
    if (suite == "H" || suite == "D") {
      return "Red";
    } else {
      return "Black";
    }
  }

  get face() {
    return this._name;
  }


  getPosition() {
    return this._position;
  }

  setPosition(x: number, y: number) {
    this.position.set(x, y);

  }
  
  flip() {
    if (!this.isActive) {
      let tl = gsap.timeline();
      tl.set(this._face.parent, { pixi: { skewY: -90 } });
      tl.to(this._back, {
        pixi: { skewY: 90 }, duration: 0.5,
        onStart: () => {
          this._face.renderable = false;
        },
        ease: 'power4.inOut'
      })
      tl.to(this._face.parent, {
        pixi: { skewY: 0 }, duration: 0.2,
        onStart: () => {

          this._face.renderable = true;
          this._back.renderable = false;

        },
        onComplete: () => {
          //this._back.renderable = false;
          this.isActive = true;
        },
        ease: 'power4.inOut'

      }, 0.5).then(() => tl.pause());
    }
  }

  get get() {
    return this._container;
  }

  get power() {
    return this._power;
  }

  addMask(sprite: PIXI.Sprite) {
    // this._face.renderable = false;
    // this._face.anchor.set(0.5);
    this._back.anchor.set(0.5);
    this._back.width = CARD_WIDTH;
    this._back.height = CARD_HEIGHT;
    const container = new PIXI.Container();

    const rect = new PIXI.Graphics();
    // this._container.interactive = true;
    rect.beginFill(0xfffff);
    rect.drawRoundedRect(0, 0, CARD_WIDTH, CARD_HEIGHT, 10);
    rect.endFill();
    rect.position.set(-CARD_WIDTH / 2, - CARD_HEIGHT / 2);
    container.addChild(rect);
   // this._face.mask = rect;
    this.addChild(container, this._back);
  }

  checkPower(card: Card) {
    if (this.power + 1 == card.power) {
      return true;
    }
    return false;
  }

  checkColor(card: Card) {
    if (this.color != card.color) {
      return false;
    } else {
      return true;
    }
  }

  add(field: GameField) {
    field.addChild(this);
    field.add(this);
    this._parent = field;
    //this.app.stage.removeChild(this);
    this.position.set(this.width / 2, this.height / 2)
  }

  setHeight(field: GameField) {
    let index = this.fields.indexOf(field);
    return this.fields[index].getCards().length * 40;
  }
}
