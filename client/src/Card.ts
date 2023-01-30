import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { CARD_WIDTH } from "./utils/constants";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export class Card extends PIXI.DisplayObject {
  sortDirty: boolean;

  calculateBounds(): void {}
  removeChild(child: PIXI.DisplayObject): void {}
  render(renderer: PIXI.Renderer): void {}

  private _name: string;
  private _spritesheet: PIXI.Spritesheet;
  private _container: PIXI.Container;
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
    this._container.on("pointerdown", (e) => {
      this._dragging = true;
      this.setPosition(e.globalX, e.globalY);
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

    if (!this._dragging) {
      const nextCardCallback = () => {
        this.getNextCard();
        this._container.removeEventListener("pointertap", nextCardCallback);
      };
      this._container.on("pointertap", nextCardCallback);
    }
  }

  get name() {
    return this._name;
  }
  get spritesheet() {
    return this._spritesheet;
  }

  getNextCard() {
    if (!this._dragging) {
      gsap.to(this.get, {
        pixi: { x: 300, y: 100, zIndex: 1 },
        repeat: 0,
        overwrite: true,
      });
    }
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
