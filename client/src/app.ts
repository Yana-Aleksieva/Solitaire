// import { Connection } from "./Connection";
// import { engine } from "./engine";

// const initForm = document.querySelector('form');
// const initSection = document.getElementById('init');
// const gameSection = document.getElementById('game');

// let connection = null;

// initForm.addEventListener('submit', async event => {
//     event.preventDefault();
//     const { nickname } = Object.fromEntries(new FormData(event.target as HTMLFormElement));

//     connection = new Connection(nickname as string);
//     await connection.open();
//     engine(connection);
//     showBoard();

//     connection.send('startGame');
// });

// document.getElementById('disconnect').addEventListener('click', () => {
//     connection?.disconnect();
//     showInit();
// });

// function showBoard() {
//     initSection.style.display = 'none';
//     gameSection.style.display = 'block';
// }

// function showInit() {
//     initSection.style.display = 'block';
//     gameSection.style.display = 'none';
// }

import * as PIXI from "pixi.js";
import { cardFactory } from "./utils/Factory";
import { Card } from "./Card";
import { GameField } from "./GameFields";

// add canvas
const app = new PIXI.Application({
  background: "0x006E33",
  width: window.innerWidth,
  height: window.innerHeight
});
document.body.appendChild(app.view as HTMLCanvasElement);

async function init() {
  await PIXI.Assets.load("/assets/22331.jpg");
}

init().then(start);

async function start() {
  //atlas data
//   const atlasData = loadSpritesheetData();
//   const spritesheet = new PIXI.Spritesheet(
//     PIXI.BaseTexture.from(atlasData.meta.image),
//     atlasData
//   );
//   await spritesheet.parse();
  
//   let i = 1;
//   const cards = await cardFactory(spritesheet);
  
  const field = new GameField(app);
  field.createFields();
//   cards.forEach((card: Card) => {
//     const sprite = new PIXI.Sprite(card.texture[card.name]);
//     sprite.position.set(300, 0);
    
//     const rect = new PIXI.Graphics();
//     rect.beginFill(0x00000);
//     rect.drawRoundedRect(0, 5, 203, 313, 20);
//     rect.endFill();
//     rect.position.set(25, 9);

//     //sprite.mask = rect;
//     console.log(sprite);
//     app.stage.addChild(sprite, rect);
//   });

//   const wk = new PIXI.Sprite(spritesheet.textures.bp);
//   const bk = new PIXI.Sprite(spritesheet.textures.AS);
//   const wb = new PIXI.Sprite(spritesheet.textures.JS);

  // bk.position.set(600, 300);
  // wb.position.set(200, 300);
  // // mask
  // const rect = new PIXI.Graphics();
  // rect.beginFill(0x00000);
  // rect.drawRoundedRect(0, 0, 203, 313, 20);
  // rect.endFill();
  // rect.position.set(25, 9);

  // bk.mask = rect;
  // bk.addChild(rect);

  // app.stage.addChild(wb,  bk);
}

function loadSpritesheetData() {
  const atlasData = {
    frames: {},
    meta: {
      image: "assets/22331.jpg",
      format: "RGBA8888",
      size: { w: 6000, h: 4000 },
      scale: "2",
    },
  };

  const color = ["w", "b"];
  const pices = [
    [ "AS", "2S", "3S", "4S", "5S", "6S", "7S", "8S", "9S", "10S", "JS", "QS", "KS",],
    [ "AH", "2H", "3H", "4H", "5H", "6H", "7H", "8H", "9H", "10H", "JH", "QH", "KH",],
    [ "AC", "2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "10C", "JC", "QC", "KC",],
    [ "AD", "2D", "3D", "4D", "5D", "6D", "7D", "8D", "9D", "10D", "JD", "QD", "KD",],
  ];
  //console.log(wk);
  for (let colorIndex = 0; colorIndex < pices.length; colorIndex++) {
    const row = pices[colorIndex];
    for (let offset = 0; offset < row.length; offset++) {
      const piece = row[offset];

      const data = {
        frame: { x: offset * 461.5, y: colorIndex * 665 + 820, w: 460, h: 666 },
        sourceSize: { w: 460, h: 666 },
        spriteSourceSize: { x: 0, y: 0, w: 461, h: 666 },
      };
      //console.log(piece);

      atlasData.frames[piece] = data;
      //  app.stage.addChild(new PIXI.Sprite())
    }
  }
  return atlasData;
}
