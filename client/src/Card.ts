import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { CARD_HEIGHT, CARD_WIDTH } from "./utils/constants";
import { addCardInGameField, getFields } from "./utils/Factory";
import { field, field1, field2, field3 } from "./utils/gameField";
import { SuitCard } from "./utils/types";


console.log([field, field1, field2, field3]);

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export class Card extends PIXI.Container {
  private _name: string;
  private _container: PIXI.Container;
  _color: SuitCard;
  _power: number;
  data
  onStart: boolean = true;
  private _dragging: boolean;
  private _position: { x: number; y: number };
  private _back: PIXI.Sprite = new PIXI.Sprite(new PIXI.Texture(new PIXI.BaseTexture("/assets/back.png")));
  isActive: boolean = false;
  private _sprite: PIXI.Sprite;
  private _suite: string;

  constructor(
    name: string,
    power: number,

    sprite: PIXI.Sprite,
    public suite: string,
    private callback: () => void,
    private callback1: () => void,
    public app: PIXI.Application
  ) {
    super();
    this.interactive = true
    this._name = name;
    this._power = power;
    //this._suite = suite;
    this._container = new PIXI.Container();
    this.position.set(100, 100);
    this.pivot.set(CARD_WIDTH / 2);
    this._dragging = false;
    this._sprite = sprite;
    this._sprite.renderable = false;
    this.addChild(this._back, this._sprite);
    this._back.scale.set(0.38);
    this.interactive = true;

    this.on('pointertap', this.onClick.bind(this));
    this.on('mousedown', this.onDragStart.bind(this))
    this.on('mouseup', this.onDragEnd.bind(this))
    this.on('mousemove', this.onDragMove.bind(this));

  }

  get sprite() {
    return this._sprite;
  }
  get color() {
    let suite = this.suite.substring(0);
    if (suite == 'H' || suite == 'D') {
      return 'Red';
    } else {
      return 'Black';
    }

  }
  set sprite(value: PIXI.Sprite) {

    this._sprite = value;
    this.addMask(this._sprite);

    this._sprite.renderable = false;
  }

  get name() {
    return this._name;
  }



  getNextCard() {
    if (!this._dragging) {
      gsap.to(this, {
        pixi: { x: 300, y: 100, zIndex: 0 },
        repeat: 0,
        duration: 0.5,
        overwrite: true,
      });
    }
  }

  getPosition() {
    return this._position;
  }

  setPosition(x: number, y: number) {
    this.position.set(x, y);
    console.log(this.name);
  }

  flip() {
    this._back.renderable = false;
    this._sprite.renderable = true;
    this.isActive = true;
  }


  // get get() {
  //   return this._container;
  // }

  get power() {
    return this._power;
  }

  addMask(sprite: PIXI.Sprite) {

    const rect = new PIXI.Graphics();
    rect.beginFill(0xfffff);
    rect.drawRoundedRect(this._sprite.x, this._sprite.y, 180, 180, 10);
    rect.endFill();

    //rect.position.set(this._sprite.x, this._sprite.y);
    sprite.mask = rect;
    sprite.addChild(rect);
  }


  onDragStart(e) {

    this.data = e.data;
    this._dragging = true;

  }
  onDragEnd(e) {

    this._dragging = false;
  //  this.callback();
    //this.position.set(e.globalX, e.globalY)
  }

  onDragMove(e) {
    if (this._dragging) {

      if (this.parent) {

        this.parent.removeChild(this);
        this.position.x = e.globalX;
        this.position.y = e.globalY;
        this.app.stage.addChild(this);
       // this.callback();
      } else {

      }

      //  this.pivot.set(200)
      // const index = this.cards.indexOf(e.target);
      //const cardsArr = this.cards.slice(index);
      // console.log(cardsArr);
      // let container = new Container();
      // console.log(this._dragging);
      //console.log(e.target.position);
      // gsap.to(this, {
      //   duration: 0.5,
      //   overwrite: true,
      //   x: e.globalX,
      //   y: e.globalY,
      //   //stagger: 0.15,
      //   ease: "none"
      // });
      // cardsArr.forEach(c => {
      // c.pivot.set(200, 200);
      //c.position.set(e.globalX, e.globalY)
      // })
      // cardsArr[0].position.x = e.globalX;
      // cardsArr[0].position.y = e.globalX;
      // this.position.set (e.globalX, e.globalY)
    }
  }


  onClick(e) {

    if (!this.isActive) {
      this.flip();
      if (this.onStart) {
        this.callback1();
        //this.sendCard(e)
      } else {
        // 
     
      }

    } else {
      this.callback();
    }
  }

  sendCard(e) {

  }
}
