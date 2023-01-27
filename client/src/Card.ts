import * as PIXI from "pixi.js";

type SuitCard = "Black" | "Red";

export class Card {
    private _name: string;
    private _spritesheet: PIXI.Spritesheet;
    private _container: PIXI.Container;
    private _suite: SuitCard;
    private _power: number;
   
    constructor(name: string, container: PIXI.Container) {
        this._name = name;
        this._container = container;
       // this.sprite = new PIXI.Sprite(spritesheet.textures.AD);
    }

    get name() {
        return this._name;
    }

    get spritesheet() {
        return this._spritesheet;
    }

    set position(x: number) {
        this._container.position.set(x, x);
    }

    get texture() {
        return this._spritesheet.textures;
    }

    get get() {
        return this._container;
    }
}