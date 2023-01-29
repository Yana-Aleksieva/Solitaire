import * as PIXI from "pixi.js";

type SuitCard = "Black" | "Red";

let x = 300;
export class Card extends PIXI.DisplayObject {
    sortDirty: boolean;

    calculateBounds(): void {
    }
    removeChild(child: PIXI.DisplayObject): void {
    }
    render(renderer: PIXI.Renderer): void {
    }
    
    private _name: string;
    private _spritesheet: PIXI.Spritesheet;
    private _container: PIXI.Container;
    private _suite: SuitCard;
    private _power: number;
   
    constructor(name: string, container: PIXI.Container,
        power: number, tempContainer: PIXI.Container ) {
            super();
        this._name = name;
        this._power = power;
        this._container = container;
        this._container.position.set(15, 15);

        this._container.interactive = true;
        this._container.on('pointertap', () => {
            tempContainer.addChild(this._container);
            this.setPosition(x, 10);
            x += 300;
        });
       // this.sprite = new PIXI.Sprite(spritesheet.textures.AD);
    }

    get name() {
        return this._name;
    }

    get spritesheet() {
        return this._spritesheet;
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