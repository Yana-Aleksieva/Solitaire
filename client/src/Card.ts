import * as PIXI from "pixi.js";

type SuitCard = "Black" | "Red";

let x = 300;
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

  constructor(
    name: string,
    container: PIXI.Container,
    power: number,
    public app: PIXI.Application) {
    super();
    this._name = name;
    this._power = power;
    this._container = container;
    this._container.position.set(15, 15);

    this._container.interactive = true;
    this._container.on("pointertap", () => {
      this.getNextCard();
    });
    // this.sprite = new PIXI.Sprite(spritesheet.textures.AD);
  }

  get name() {
    return this._name;
  }

  get spritesheet() {
    return this._spritesheet;
  }

  getNextCard() {
    const tempContainer = new PIXI.Container();
    tempContainer.position.set(300, 10);

    tempContainer.addChild(this.get);
    this.app.stage.addChild(tempContainer);
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
