import { Container } from "pixi.js";
import { Card } from "./Card";

export class Tank extends Container {
  cards: Card[] = [];

  constructor(
    x: number,
    y: number,
    cards: [],
   private callback: () => void
  ) {
    super();
    this.position.set(x, y);
    this.interactive = true;
    this.cards = cards;

    this.on('pointertap', this.onClick.bind(this));
  }

  add(child: Card) {
    this.addChild(child);
    this.cards.push(child);
  }

  filter(card: Card) {
    let current = this.cards.filter((c) => c === card);
    return current[0];
  }


  remove(card: Card) {
    this.removeChild(card);
    const index = this.getCardIndex(card);
    this.cards.splice(index, 1);
  }

  getCardIndex(card: Card) {
    return this.cards.indexOf(card);
  }

  onClick(e){
    console.log(e.target, this.cards);
    this.callback();
  }
}
