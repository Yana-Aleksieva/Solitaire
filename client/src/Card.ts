import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { CARD_HEIGHT, CARD_WIDTH } from "./utils/constants";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export class Card extends PIXI.Container {
  sortDirty: boolean;

  // calculateBounds(): void { }
  // removeChild(child: PIXI.DisplayObject): void { }
  // render(renderer: PIXI.Renderer): void { }

  private _name: string;
  private _container: PIXI.Container;
  private _power: number;
  private _dragging: boolean;
  private _position: { x: number; y: number };
  private _back: PIXI.Sprite = new PIXI.Sprite(new PIXI.Texture(new PIXI.BaseTexture("/assets/back.png")));
 isActive: boolean = false;
  private _sprite: PIXI.Sprite


  constructor(
    name: string,
    power: number,
    sprite: PIXI.Sprite,
    public app: PIXI.Application
  ) {
    super();
    this.interactive = true
    this._name = name;
    this._power = power;
    this._container = new PIXI.Container();
    this._container.position.set(100, 100);
    this._container.pivot.set(CARD_WIDTH / 2);
    this._dragging = false;
    this._sprite = sprite;
    this._sprite.renderable = false;
    this._container.addChild(this._back, this._sprite);
    this._back.scale.set(0.38);
    this._container.interactive = true;


    this._container.on("pointerdown", (e) => {
      this._dragging = true;
      //this.setPosition(e.globalX, e.globalY);

    });
    this._container.on("mousemove", (e) => {
      if (this._dragging) {
        this.setPosition(e.globalX, e.globalY);

      }
    });

    this._container.on("pointerup", (e) => {
      this._dragging = false;


      this.setPosition(e.globalX, e.globalY);
    });

    if (!this._dragging && !this.isActive) {
      const nextCardCallback = () => {
        this.getNextCard();
        this.isActive = true;
        this._sprite.renderable = true;
        this._back.renderable = false;

        this._container.removeEventListener("pointertap", nextCardCallback);
      };
      this._container.on("pointertap", nextCardCallback);
    }
  }
  get sprite() {
    return this._sprite;
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
      gsap.to(this.get, {
        pixi: { x: 300, y: 100, zIndex: 0 },
        repeat: 0,
        duration: 0.5,
        overwrite: true,
      });
    }
  }

  setPosition(x: number, y: number) {
    this._container.position.set(x, y);
    console.log(this.name);
  }

  public flip() {
    this._back.renderable = false;
    this._sprite.renderable = true;
  }


  get get() {
    return this._container;
  }

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


}
