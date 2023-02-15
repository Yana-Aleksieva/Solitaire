import * as PIXI from "pixi.js";
import { GameField } from "./GameFields";
import { shuffleCards } from "./animations";
import { createSprites, createbackSprites, getFields } from "./utils/Factory";
import { CARD_HEIGHT, CARD_WIDTH, WINDOW_WIDTH } from "./utils/constants";
import { getFoundations } from "./utils/gameField";
// import { Engine } from "./websocket/engine";

export class App extends PIXI.Container {
  private _app: PIXI.Application;
  private _state;
  //private _engine: Engine;

  public stock: GameField;
  public waste: GameField;
  public piles: GameField[];
  public foundations: GameField[];
  public backs = [];
  public sprites = [];

  constructor(state, onPlace) {
    super();
    this._app = new PIXI.Application({
      background: "0x006E33",
      width: window.innerWidth,
      height: window.innerHeight,
    });
    //this._engine = new Engine(connection);
    this.initStage(state, onPlace);
  }

  initStage(state, onPlace) {
    this._state = state;
    this.createStock();
    this.createWaste();
    this.createPiles();
    this.createFoundations();
    this.backs = createbackSprites();
    this.stock.addChild(...this.backs);
    this.sprites = createSprites();
    this.addPiles();

    // this.interactive = true;
    // this.on("pointertap", onPlace);
    this._app.stage.on("pointertap", onPlace);

    // this.stock.on("pointertap", onPlace);
    // this.piles.forEach((p) => p.on("pointertap", onPlace));
    // this.foundations.forEach((f) => f.on("pointertap", onPlace));

    // add animations
   // shuffleCards(this.stock, this.waste);
  }
  addPiles() {
    this.piles.forEach((pile) => {
      let bottomPositon = 0;
      //render cards from server
      pile.cards.forEach((card, i) => {
        if (!card.faceUp) {
          const back: PIXI.Sprite = new PIXI.Sprite(
            new PIXI.Texture(new PIXI.BaseTexture("/assets/back.png"))
          );
          back.width = CARD_WIDTH;
          back.height = CARD_HEIGHT;
          back.position.set(0, bottomPositon);
          pile.addChild(back);
        } else {
          const currentCard = this.sprites.find(
            (s) => s.face == card.face && s.suite == card.suit
          );
          currentCard.sprite.position.set(0, bottomPositon);
          pile.addChild(currentCard.sprite);
        }
        bottomPositon += 40;
      });
    });
  }

  get view() {
    return this._app.view;
  }

  createStock() {
    this.stock = new GameField(0, 50, 80, this._state.stock.cards, "stock");
    this._app.stage.addChild(this.stock);
  }

  createWaste() {
    this.waste = new GameField(
      -1,
      (WINDOW_WIDTH / 7) * 2 - 210,
      80,
      this._state.waste.cards,
      "stock"
    );
    this._app.stage.addChild(this.waste);
  }

  createPiles() {
    this.piles = getFields(this._state.piles);
    this._app.stage.addChild(...this.piles);
  }

  createFoundations() {
    this.foundations = getFoundations();
    this._app.stage.addChild(...this.foundations);
  }
}
