import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { CARD_HEIGHT, CARD_WIDTH } from "./utils/constants";
import { SuitCard } from "./utils/types";
import { Tank } from "./Tank";
import { GameField } from "./GameFields";


gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export class Card extends PIXI.Container {
  private _name: number;

  _color: SuitCard;
  _power: number;
  _parent: GameField | Tank;
  onStart: boolean = true;
  index: number
  private _position: { x: number; y: number };
  private _back: PIXI.Sprite = new PIXI.Sprite(
    new PIXI.Texture(new PIXI.BaseTexture("/assets/back.png"))
  );
  private _container = new PIXI.Container();
  isActive: boolean = false;
  private _sprite: PIXI.Sprite;
  private _suite: string;
  public fields: GameField[];
  public faceUp = false;

  constructor(
  ) {
    super();
    this.initCard();
    this.on('pointertap', () => this.index = (this.parent as GameField).sprites.indexOf(this))
  }
  initCard() {

    this.interactive = true;
    this.fields = [];
    this._back.width = CARD_WIDTH;
    this._back.height = CARD_HEIGHT;
    this._container.addChild(this._back);
    this.addChild(this._container);
    this.interactive = true;
  }
  selectCard() {
    const tl = gsap.timeline();
    gsap.to(this._sprite, { pixi: { tint: 0x00000, colorize: 0xC1E1C1, alpha: 1 }, duration: 0.5 });

    setTimeout(() => {
      tl.reverse();
    }, 3000);

    
    console.log("select card")
  }

  get sprite(): PIXI.Sprite {
    return this._sprite;
  }

  get suite() {
    return this._suite;
  }

  set suite(suite: string) {
    this._suite = suite;
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

  set sprite(sprite: PIXI.Sprite) {

    this._back.renderable = false;
    this._sprite = sprite;
    this._sprite.width = CARD_WIDTH;
    this._sprite.height = CARD_HEIGHT;
    this._container.addChild(sprite);
    this._back.position.set(0);
    this._sprite.position.set(0)

  }


  getPosition() {
    return this._position;
  }

  // setPosition(x: number, y: number) {
  //   this.position.set(x, y);

  // }

  flip() {
    if (!this.isActive) {
      this._back.renderable = true;

      this._sprite.renderable = false;
      let tl = gsap.timeline();
      tl.set(this._sprite, { pixi: { skewY: -90 } });
      tl.to(this._back, {
        pixi: { skewY: 90 }, duration: 0.5,
        onStart: () => {
         
          this._sprite.renderable = false;
        },
        ease: 'power4.inOut'
      })
      tl.to(this._sprite, {
        pixi: { skewY: 0 }, duration: 0.2,
        onStart: () => {

          this._sprite.renderable = true;
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



  get power() {
    return this._power;
  }

  set power(power: number) {
    this._power = power;
  }

  // addMask(sprite: PIXI.Sprite) {

  //   this._back.anchor.set(0.5);
  //   this._back.width = CARD_WIDTH;
  //   this._back.height = CARD_HEIGHT;
  //   const container = new PIXI.Container();

  //   const rect = new PIXI.Graphics();
  //   rect.beginFill(0xfffff);
  //   rect.drawRoundedRect(0, 0, CARD_WIDTH, CARD_HEIGHT, 10);
  //   rect.endFill();
  //   rect.position.set(-CARD_WIDTH / 2, - CARD_HEIGHT / 2);
  //   container.addChild(rect);

  // }

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

  // add(field: GameField) {
  //   field.addChild(this);
  //   field.add(this);
  //   this._parent = field;
  //   //this.app.stage.removeChild(this);
  //   this.position.set(this.width / 2, this.height / 2)
  // }

  // setHeight(field: GameField) {
  //   let index = this.fields.indexOf(field);
  //   return this.fields[index].getCards().length * 40;
  // }

  setBack() {
    this._back.renderable = true;
    this._container.removeChild(this._sprite)
    //this._back.pivot.set(CARD_WIDTH/2, CARD_HEIGHT/2)
  }
}
