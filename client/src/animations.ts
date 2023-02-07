import gsap from "gsap";
import { Card } from "./Card";
import { GameField } from "./GameFields";
import * as PIXI from "pixi.js";
import { PixiPlugin } from "gsap/PixiPlugin";


gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

const tl = gsap.timeline();

export function dealCards(cards: Card[], fields: GameField[], app) {
  
    let index = 0;
    let positionIndex = 0;

    for (let i = 0; i < 7; i++) {
        let fieldIndex = 100 + i * 250;

        for (let j = i; j < 7; j++) {
            const f: GameField = fields[j];
            const card = cards[cards.length - index - 1];

            const cardContainer = cards[cards.length - index - 1]
            tl.to(card,
                {
                    pixi: { x: f.x + card.width, y: f.y + card.height + positionIndex },
                    duration: 0.3,

                    onComplete: () => {

                        app.stage.addChild(card)
                        card.onStart = false;
                        card._parent = f;

                        if (j == i) {
                            card.flip();
                        }
                    },
                    ease: "sine.inOut",
                }, '>').then(() => {

                    tl.kill()
                });
            index++;
            fieldIndex += 250;

        }
        positionIndex += 30;


    }
}

export function shuffleCards(cards: Card[]) {
   
    tl.to(cards,
        {
            pixi: {

                x: 300,

            },
            duration: 0.1,
            repeat: 0,
            delay: 1,
            stagger: {
                each: 0.1,
                from: 'random',

            },
        });

    +       tl.to(cards,
        {
            pixi: {

                x: 100,

            },
            duration: 0.1,
            repeat: 0,
            ease: "power2.inOut",
            stagger: {
                each: 0.1,
                from: 'random'
            }

        }).then(() => tl.kill());

}