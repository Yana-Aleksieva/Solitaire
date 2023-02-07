
import * as PIXI from 'pixi.js';
import { Container, DisplayObject, TextStyle, Text } from 'pixi.js';

const style = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 24,

    fontWeight: "bolder",
    fill: 0xffffff
});


export class TextArea extends Container {

    _label: string;
    text: Text;

    constructor(

        label: string,
        //private element: DisplayObject,



    ) {
        super();

        //this.addChild(this.element);
        this.text = new Text('', style);
        this.text.anchor.set(0.5, 0.5);
        this.label = label;
        this.addChild(this.text);

        this.interactive = true;

    }

    get label() {
        return this._label;
    }

    set label(value: string) {
        this._label = value;
        this.text.text = value;
        this.text.position.set(this.width / 2, this.height / 2);
    }

    reset() {
        this.text.text = '';
    }

   

    

}