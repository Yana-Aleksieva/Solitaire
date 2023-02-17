import * as PIXI from "pixi.js";
import { GameField } from "./GameFields";
import { shuffleCards } from "./animations";
import { createSprites, createbackSprites, getFields } from "./utils/Factory";
import { CARD_HEIGHT, CARD_WIDTH, offset, WINDOW_WIDTH } from "./utils/constants";
import { getFoundations } from "./utils/gameField";
import { TextArea} from './utils/TextArea'

export class App extends PIXI.Container {
  private _app: PIXI.Application;
  state;
  //private _engine: Engine;

  public stock: GameField;
  public waste: GameField;
  public piles: GameField[];
  public foundations: GameField[];
  public backs = [];
  public sprites = [];
  public score: TextArea

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
    this.state = state;
    this.createStock();
    this.createWaste();
    this.createPiles();
    this.createFoundations();
    this.backs = createbackSprites();
    this.stock.addChild(...this.backs);
    this.sprites = createSprites();
    this.addPiles();
    this.addFounationsCards();
    this.addScore();

    this._app.stage.on("pointertap", onPlace);

  }

  addScore(){
    this.score = new TextArea('Score: 0');
    this._app.stage.addChild(this.score);
    this.score.position.set(screen.width - 300, 30)
  }

  addFounationsCards() {
    this.foundations.forEach(gf => {
      gf.cards.forEach(card => {
        if(card){
         let sprite = this.sprites.find(
            (s) => s.face == card.face && s.suite == card.suit
          );
          gf.addChild(sprite.sprite)
        }
       

      })

    })
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
        bottomPositon += offset;
      });
    });
  }

  get view() {
    return this._app.view;
  }

  createStock() {
    this.stock = new GameField(0, 50, 80, this.state.stock.cards, "stock");
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
}
