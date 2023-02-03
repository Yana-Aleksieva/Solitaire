import { Container } from "pixi.js";
import { Card } from "./Card";

export class Tank extends Container {
  cards: Card[] = [];

  constructor(
    x: number,
    y: number
    // private callback: () => void
  ) {
    super();
    this.pivot.set(100);
    this.position.set(x, y);
    this.interactive = true;
    //this.on('pointertap', this.onClick.bind(this));
  }

  add(child: Card) {
    this.addChild(child);
    this.cards.push(child);
  }

  filter(card: Card) {
    let current = this.cards.filter((c) => c === card);
    return current[0];
  }

  // onClick() {
  //     console.log('click');
  //     const len = this.cards.length;
  //     const currentCard = this.cards[len - 1];
  //     //this.callback();
  //     currentCard.flip();
  //    // this.remove(currentCard);

  // }

  remove(card: Card) {
    this.removeChild(card);
    const index = this.getCardIndex(card);
    this.cards.splice(index, 1);
  }

  getCardIndex(card: Card) {
    return this.cards.indexOf(card);
  }
}
