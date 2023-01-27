import * as PIXI from "pixi.js";

let cards = [];

let y = 850;

export function createCards(card) {


    for (let i = 0; i <= 3; i++) {

        let x = 50;

        for (let j = 0; j <= 12; j++) {

            const container = new PIXI.Container();
            const clubTexture = new PIXI.Texture(card, new PIXI.Rectangle(x, y, 400, 620));
            const clubSprite = new PIXI.Sprite(clubTexture);

            clubSprite.width = 120;
            clubSprite.height = 150;

            //create mask
            const rect = new PIXI.Graphics();
            rect.beginFill(0x00000);
            rect.drawRoundedRect(clubSprite.position.x, clubSprite.position.y, 120, 150, 10);
            rect.endFill();

            // clubSprite.addChild(rect);
            // clubSprite.anchor.set(0.5, 0.5)
            clubSprite.mask = rect;
            container.addChild(clubSprite, rect)
           
            cards.push(container);
            x += 458;

        }

        y += 660;


    }




    return cards;
}