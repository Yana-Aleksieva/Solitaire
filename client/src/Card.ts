import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { CARD_HEIGHT, CARD_WIDTH } from "./utils/constants";
import { addCardInGameField, moveCardFromMainDeckToFlipDeck } from "./utils/Factory";
import { field, field1, field2, field3 } from "./utils/gameField";
import { SuitCard } from "./utils/types";
import { Tank } from "./Tank";


console.log([field, field1, field2, field3]);

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export class Card extends PIXI.Container {
  private _name: string;
  private _container: PIXI.Container;
  _color: SuitCard;
  _power: number;
  data
  private _dragging: boolean;
  private _position: { x: number; y: number };
  private _back: PIXI.Sprite = new PIXI.Sprite(new PIXI.Texture(new PIXI.BaseTexture("/assets/back.png")));
  isActive: boolean = false;
  private _sprite: PIXI.Sprite;
  private _suite: string;
  private flipContainer: Tank;
  private _cardContainer: Tank;

  constructor(
    name: string,
    power: number,
    sprite: PIXI.Sprite,
    public suite: string,
    public app: PIXI.Application,
    cardContainer: Tank,
  ) {
    super();
    this.interactive = true
    this._name = name;
    this._power = power;
    //this._suite = suite;
    this._container = new PIXI.Container();
    this.flipContainer = new Tank(300, 100);
    this._cardContainer = cardContainer;
    this.position.set(100, 100);
    this.pivot.set(CARD_WIDTH / 2);
    this._dragging = false;
    this._sprite = sprite;
    this._sprite.renderable = false;
    this.addChild(this._back, this._sprite);
    this._back.scale.set(0.38);

    this._container.interactive = true;
    this._container.addChild(this);

    this.app.stage.addChild(this.flipContainer);
    // this._container.on("pointerdown", (e) => {
    //   this._dragging = true;
    //   //this.setPosition(e.globalX, e.globalY);

    // });
    // this._container.on("mousemove", (e) => {
    //   // 930
    //   // 1180
    //   // 1430
    //   // 1680
    //   if (this._dragging) {
    //     this.setPosition(e.globalX, e.globalY);
    //     this._position = { x: e.globalX, y: e.globalY }

    //     console.log(e.globalX)
    //     if (e.globalX == 930) {
    //       addCardInGameField(field, this);
    //       this.setPosition(-100, -100);
    //     } else if (e.globalX == 1180) {
    //       addCardInGameField(field1, this);
    //       this.setPosition(-100, -100);
    //     } else if (e.globalX == 1430) {
    //       addCardInGameField(field2, this);
    //       this.setPosition(-100, -100);
    //     } else if (e.globalX == 1680) {
    //       addCardInGameField(field3, this);
    //       this.setPosition(-100, -100);
    //     }
    //   }
    // });

    // this._container.on("pointerup", (e) => {
    //   this._dragging = false;
    //   this.setPosition(e.globalX, e.globalY);
    // });

    // if (!this._dragging && !this.isActive) {
    //   const nextCardCallback = () => {
    //     this.getNextCard();
    //     this.isActive = true;
    //     this._sprite.renderable = true;
    //     this._back.renderable = false;

    //     this._container.removeEventListener("pointertap", nextCardCallback);
    //   };
    //   this._container.on("pointertap", nextCardCallback);
    // }

    this.interactive = true;

    this.on('pointertap', this.onClick);
    this.on('mousedown', this.onDragStart)
    this.on('mouseup', this.onDragEnd)
    this.on('mousemove', this.onDragMove);
  }

  get sprite(): PIXI.Sprite {
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

  get get() {
    return this._container;
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
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = e.data;
    this._dragging = true;
  }
  onDragEnd(e) {
    // this.alpha = 1;
    // set the interaction data to null
    this.data = null;
    //this.position.set(e.globalX, e.globalY);

    this._dragging = false;
    //this.removeEventListener('on')
  }

  onDragMove(e) {
    if (this._dragging && this.parent) {
      // console.log('clicked');
      //console.log(this.parent);
      this.parent.removeChild(this);
      this.app.stage.addChild(this);

      this.position.x = e.globalX;
      this.position.y = e.globalY;
      console.log(this.position.x)
      if (this.position.x == 930) {
        const isAdded = addCardInGameField(field, this);
        if (isAdded){
          this.setPosition(-100, -50);
          this.app.stage.removeChild(this);
        }
      } else if (this.position.x == 1180) {
        const isAdded = addCardInGameField(field1, this);
        if (isAdded) {
          this.setPosition(-100, -50);
          this.app.stage.removeChild(this);
        }
      } else if (this.position.x == 1420) {
        const isAdded = addCardInGameField(field2, this);
        if (isAdded) {
          this.setPosition(-100, -50);
          this.app.stage.removeChild(this);
        }
      } else if (this.position.x == 1670) {
        const isAdded = addCardInGameField(field3, this);
        if (isAdded) {
          this.setPosition(-100, -50);
          this.app.stage.removeChild(this);
        }
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
    console.log(this._cardContainer.cards.length);
    //const index = this.getChildIndex(this);
      const current = this._cardContainer.cards[this._cardContainer.cards.length - 1];
      this._cardContainer.removeChild(this);
      const tempContainer = new PIXI.Container();
      tempContainer.addChild(current);
      this.flipContainer.addChild(tempContainer);
      this.flip();
    if (!this.isActive) {
     
      //moveCardFromMainDeckToFlipDeck(this, this.flipContainer);
      //this.app.stage.removeChild(this);
      //this.position.set(300, 100)
    }
  }
}
