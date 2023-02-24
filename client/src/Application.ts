import * as PIXI from "pixi.js";
import { GameField } from "./GameFields";
import { flipCard } from "./animations";
import { createSprites, createbackSprites, getFields } from "./utils/Factory";
import { CARD_HEIGHT, CARD_WIDTH, offset, WINDOW_WIDTH } from "./utils/constants";
import { getFoundations } from "./utils/gameField";
import { TextArea } from './utils/TextArea'
import { Card } from "./Card";

export class App extends PIXI.Container {
  private _app: PIXI.Application;
  public state: any;

  public stock: GameField;
  public waste: GameField;
  public piles: GameField[];
  public foundations: GameField[];
  public backs = [];
  public sprites = [];
  public score: TextArea;
  public isActive: boolean = false;

  constructor(state: any, onPlace: (e: PIXI.FederatedMouseEvent) => void) {
    super();
    this._app = new PIXI.Application({
      background: "0x006E33",
      width: window.innerWidth,
      height: window.innerHeight,
    });

    this.initStage(state, onPlace);
  }

  initStage(state: any, onPlace: (e: PIXI.FederatedMouseEvent) => void) {
    this.sprites = createSprites();
    this.state = state;
    this.createStock();
    this.createWaste();
    this.createPiles();
    this.createFoundations();
    this.backs = createbackSprites();
    //this.stock.addChild(...this.backs);

    this.addPiles();
    this.addFounationsCards();
    this.addScore();
    this._app.stage.on("pointertap", onPlace);
  }

  addScore() {
    this.score = new TextArea('Score: 0');
    this._app.stage.addChild(this.score);
    this.score.position.set(screen.width - 300, 30)
  }

  addFounationsCards() {
    this.foundations.forEach((gf: GameField) => {
      gf.cards.forEach(card => {
        if (card) {
          let sprite = this.sprites.find(
            (s) => s.face == card.face && s.suite == card.suit
          );
          gf.addChild(sprite.sprite)
        }
      })
    })
  }

  addPiles() {
    this.piles.forEach((pile: GameField) => {
      let bottomPositon = 0;
      //render cards from server
      pile.cards.forEach((card, i) => {
        const newCard = new Card();
        pile.addChild(newCard);
        if (!card.faceUp) {
          newCard.position.set(0,  bottomPositon);
        } else {
          const currentCard = this.sprites.find(
            (s) => s.face == card.face && s.suite == card.suit);
          console.log("currentCard");

          newCard.sprite = currentCard.sprite;
          newCard.suite = currentCard.suite;
          newCard.power = currentCard.face;
         newCard.position.set(0, bottomPositon);
        }

        pile.sprites.push(newCard);
        // pile.cards.push(card);
        bottomPositon += offset;
      });
    });
    console.log(this.piles);
  }

  get view() {
    return this._app.view;
  }

  createStock() {
    this.stock = new GameField(0, 50, 80, this.state.stock.cards, "stock");
    this.stock.cards.forEach((card) => {
      const c = new Card();
      this.stock.sprites.push(c);

      this.stock.addChild(c);
      //c.position.set(CARD_WIDTH / 2, CARD_HEIGHT / 2);
    })
    this._app.stage.addChild(this.stock);
  }

  createWaste() {
    this.waste = new GameField(
      -1,
      (WINDOW_WIDTH / 7) * 2 - 210,
      80,
      this.state.waste.cards,
      "stock"
    );
    // console.log(this.waste.sprites)
    this.waste.cards.forEach(s => {
      const card = new Card();
      const spriteCard = this.sprites.find(c => c.face == s.face && c.suite == s.suit);

      card.sprite = spriteCard.sprite;
      this.waste.addChild(card);
     // card.position.set(CARD_WIDTH / 2, CARD_HEIGHT / 2);
      //s.sprite.renderable = true
    })
    console.log(this.waste.sprites);
    this._app.stage.addChild(this.waste);
  }

  createPiles() {
    this.piles = getFields(this.state.piles);
    this._app.stage.addChild(...this.piles);
  }

  createFoundations() {
    this.foundations = getFoundations(this.state);
    this._app.stage.addChild(...this.foundations);
    console.log(this.foundations)
  }
  findSprite(card) {
    let sprite = this.sprites.find(s => card.face === s.face && card.suit === s.suite);
    return sprite;
  }
  flip(card, bac) {
    flipCard(card, bac)
  }
}
