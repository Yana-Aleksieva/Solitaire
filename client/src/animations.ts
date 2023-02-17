import gsap from "gsap";
import { Card } from "./Card";
import { GameField } from "./GameFields";
import * as PIXI from "pixi.js";
import { PixiPlugin } from "gsap/PixiPlugin";
import { CARD_WIDTH, offset } from "./utils/constants";
import { DisplayObject } from "pixi.js";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);



export function dealCards(cards: Card[], fields: GameField[], app) {
  const tl = gsap.timeline();
  let index = 0;
  let positionIndex = 0;

  for (let i = 0; i < 7; i++) {
    let fieldIndex = 100 + i * 250;

    for (let j = i; j < 7; j++) {
      const f: GameField = fields[j];
      const card = cards[cards.length - index - 1];
      tl.to(
        card,
        {
          pixi: { x: f.x + card.width, y: f.y + card.height + positionIndex },
          duration: 0.3,
          onComplete: () => {
            app.stage.addChild(card);
            card.onStart = false;
            card._parent = f;

            if (j == i) {
              card.flip();
            }
          },
          ease: "sine.inOut",
        },
        ">"
      ).then(() => {
        tl.kill();
      });
      index++;
      fieldIndex += 250;
    }
    positionIndex += 30;
  }
}

export function selectCard(card: DisplayObject) {

  const tl = gsap.timeline();
  gsap.to(card, { pixi: { tint: 0x00000 }, duration: 5 });
  tl.pause();
}

export function shuffleCards(cards: Card[]) {
  const tl = gsap.timeline();
  tl.to(cards, {
    pixi: {
      x: 300,
    },
    duration: 0.1,
    repeat: 0,
    delay: 1,
    stagger: {
      each: 0.1,
      from: "random",
    },
  });

  tl
    .to(cards, {
      pixi: {
        x: 100,
      },
      duration: 0.1,
      repeat: 0,
      ease: "power2.inOut",
      stagger: {
        each: 0.1,
        from: "random",
      },
    })
    .then(() => tl.kill());
}
// export function shuffleCards(parent: PIXI.DisplayObject, parent1: PIXI.Container) {
//   const tl = gsap.timeline();
//     parent1.renderable = false;
//     const children = parent.children.slice(0)

//     tl.to(children,
//         {
//             pixi: {
//                 x: parent1.x - CARD_WIDTH / 2,
//             },
//             duration: 0.1,
//             repeat: 0,
//             delay: 1,
//             stagger: {
//                 each: 0.1,
//                 from: 'random',
//             },
//     }).then(() => tl.reverse()).then(() => tl.kill());
// }

export function moveCard(card: DisplayObject, target: GameField) {

  const tl = gsap.timeline();
  tl.to(card, { pixi: { rotation: 500 }, duration: 2, ease: 'sine.inOut' })
  // gsap.to(card, {pixi:{x: 0, y:  target.cards.length * offset},  duration: 1, ease: 'sine.inOut' })
  tl.pause();

}

export function flipCard(sprite, back) {
 
  let tl = gsap.timeline();
 tl.set(sprite.parent, { pixi: { skewY: -90 } });
  tl.to(back, {
    pixi: { skewY: 90 }, duration: 1,
    onStart: () => {
      sprite.renderable = false;
    },
    ease: 'power4.inOut'
  })
  // tl.to(sprite.parent, {
  //   pixi: { skewY: 0 }, duration: 1,
  //   onStart: () => {

  //     sprite.renderable = true;
  //     back.renderable = false;

  //   },
  //   onComplete: () => {
  //     //this._back.renderable = false;
  //     this.isActive = true;
  //   },
  //   ease: 'power4.inOut'

  // }, 1).then(() => tl.pause());
}