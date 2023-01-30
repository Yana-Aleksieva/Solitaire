import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin"

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

type SuitCard = "Black" | "Red";

let x = 300;
import { CARD_WIDTH } from "./utils/constants";

export class Card extends PIXI.DisplayObject {
  sortDirty: boolean;

  calculateBounds(): void {}
  removeChild(child: PIXI.DisplayObject): void {}
  render(renderer: PIXI.Renderer): void {}

  private _name: string;
  private _spritesheet: PIXI.Spritesheet;
  private _container: PIXI.Container;
  private _suite: SuitCard;
  private _power: number;
  private _dragging: boolean;
  private _position: { x: number; y: number };

  constructor(
    name: string,
    container: PIXI.Container,
    power: number,
    public app: PIXI.Application
  ) {
    super();
    this._name = name;
    this._power = power;
    this._container = container;
    this._container.position.set(100, 100);
    this._container.pivot.set(CARD_WIDTH / 2);
    this._dragging = false;

    this._container.interactive = true;

    this._container.on("mousedown", (e) => {
      console.log("mousedown" , e.globalX, e.globalY);
      this._dragging = true;
      this._container.pivot.set(CARD_WIDTH / 2);
      //this.position = { x: e.globalX, y: e.globalX };
      //this.setPosition(e.globalX, e.globalY);
    });
    this._container.on("mousemove", (e) => {
      if (this._dragging) {
        console.log("mousemove", e.globalX, e.globalY);
        this.setPosition(e.globalX, e.globalY);
      }
    });
    this._container.on("mouseup", (e) => {
      this._dragging = false;
      console.log("mouseup");
      console.log("mouseup", e.globalX, e.globalY);
      this._container.pivot.set(CARD_WIDTH / 2);
      //this.setPosition(e.globalX, e.globalY);
    });

    const nextCardCallback = () => {
        this.getNextCard();
        //this._container.removeEventListener("pointertap", nextCardCallback);
    };
    this._container.on("pointertap", nextCardCallback);

    

    // this.sprite = new PIXI.Sprite(spritesheet.textures.AD);
  }

  get name() {
    return this._name;
  }
  get spritesheet() {
    return this._spritesheet;
  }

  getNextCard() {
    // const tempContainer = new PIXI.Container();
    // tempContainer.position.set(300, 10);
    const animation = gsap.to(this.get, { pixi: { x: 300, y: 100, zIndex: 1 }, repeat: 0 });
    //animation.pause();
    //this._container.visible = false;
    // tempContainer.addChild(this.get);
    // this.app.stage.addChild(tempContainer);
  }

  setPosition(x: number, y: number) {
    this._container.position.set(x, y);
    console.log(this.name);
  }

  get texture() {
    return this._spritesheet.textures;
  }

  get get() {
    return this._container;
  }

  get power() {
    return this._power;
  }
}
