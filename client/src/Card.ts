import * as PIXI from "pixi.js";

export class Card {
    private _name: string;
    private _spritesheet: PIXI.Spritesheet;

    constructor(name: string, spritesheet: PIXI.Spritesheet) {
        this._name = name;
        this._spritesheet = spritesheet;
       // this.sprite = new PIXI.Sprite(spritesheet.textures.AD);
    }

    get name() {
        return this._name;
    }

    get spritesheet() {
        return this._spritesheet;
    }

    get texture() {
        return this._spritesheet.textures;
    }
}