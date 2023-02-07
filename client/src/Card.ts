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
  private _name: string;
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
  private face: PIXI.Sprite;
  private _suite: string;
  private _cardContainer: Tank;
  public fields: GameField[];

  constructor(
    name: string,
    power: number,
    sprite: PIXI.Sprite,
    public suite: string,
    private callback1: () => void,
    public app: PIXI.Application
  ) {
    super();
    this.interactive = true;
    this._name = name;
    this._power = power;
    this.fields = [];
    this._container = new PIXI.Container();
    this.pivot.set(CARD_WIDTH / 2, CARD_HEIGHT / 2);
    this._dragging = false;
    this.face = sprite;


    this.interactive = true;
    this.addMask(this.face);
    // this.on("pointertap", this.onClick.bind(this));
    // this.on("mousedown", this.onDragStart.bind(this));
    // this.on("mouseup", this.onDragEnd.bind(this));
    // this.on("mousemove", this.onDragMove.bind(this));
  }

  getCurrentField(x: number, y: number): GameField | null {

    if (x >= 77 && x <= 260 && y >= 400 && y <= 750) {
      return this.fields[0];
    } else if (x >= 330 && y >= 400 && y <= 750) {
      return this.fields[1];
    } else if (x >= 580 && y >= 400 && y <= 750) {
      return this.fields[2];
    } else if (x >= 830 && y >= 400 && y <= 750) {
      return this.fields[3];
    } else if (x >= 1080 && y >= 400 && y <= 750) {
      return this.fields[4];
    } else if (x >= 1300 && y >= 400 && y <= 750) {
      return this.fields[5];
    } else if (x >= 1585 && y >= 400 && y <= 750) {
      return this.fields[6];
    }
    return null;
  }

  get sprite(): PIXI.Sprite {
    return this.face;
  }

  get color() {
    let suite = this.suite.substring(0);
    if (suite == "H" || suite == "D") {
      return "Red";
    } else {
      return "Black";
    }
  }


  get name() {
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


      tl.set(this.face.parent, { pixi: { skewY: -90 } });

      tl.to(this._back, {
        pixi: { skewY: 90 }, duration: 0.5,
        onStart: () => {

          this.face.renderable = false;

        },
        ease: 'power4.inOut'

      })
      tl.to(this.face.parent, {
        pixi: { skewY: 0 }, duration: 0.2,
        onStart: () => {

          this.face.renderable = true;
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

    this.face.renderable = false;
    this.face.anchor.set(0.5);
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
    container.addChild(this.face, rect);
    this.face.mask = rect;


    this.addChild(container, this._back);
  }

  onDragStart(e) {


    this._dragging = true;

    if (!this.onStart) {

      const currentField = this.getCurrentField(e.globalX, e.globalY);
      currentField.removeCard(this);
    }

  }
  onDragEnd(e) {

    // this._dragging = false;
    // if (this.position.y < 300) {
    //   if (this.position.x > 800 && this.position.x < 1000) {

    //     const isAdded = addCardInGameField(field, this);
    //     if (isAdded) {
    //       this.setPosition(-100, -100);
    //       this.app.stage.removeChild(this);
    //       this._parent = field;
    //     }
    //   }

    //   else if (this.position.x > 1000 && this.position.x < 1250) {

    //     const isAdded = addCardInGameField(field1, this);
    //     if (isAdded) {
    //       this.setPosition(-100, -100);
    //       this.app.stage.removeChild(this);
    //       this._parent = field1;
    //     }
    //   } else if (this.position.x > 1250 && this.position.x < 1500) {

    //     const isAdded = addCardInGameField(field2, this);
    //     if (isAdded) {
    //       this.setPosition(-100, -100);
    //       this.app.stage.removeChild(this);
    //       this._parent = field2;
    //     }
    //   } else if (this.position.x >= 1500) {

    //     const isAdded = addCardInGameField(field3, this);
    //     if (isAdded) {
    //       this.setPosition(-100, -100);
    //       this.app.stage.removeChild(this);
    //       this._parent = field3;
    //     }
    //   }

    // }


  }

  onDragMove(e) {

    // if (this._dragging && this.isActive) {
    //   this.parent.removeChild(this);
    //   this.app.stage.addChild(this);
    //   this.position.x = e.globalX;
    //   this.position.y = e.globalY;


    //}
  }

  onClick(e) {

    if (!this.isActive) {
      this.flip();
      if (this.onStart) {
        this.callback1();

      } else {
        this.flip();
      }
    }
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
    this.app.stage.removeChild(this);
    this.position.set(this.width / 2, this.height / 2)
  }

  setHeight(field: GameField) {
    let index = this.fields.indexOf(field);
    return this.fields[index].getCards().length * 40;
  }
}
