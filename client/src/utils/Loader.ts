import * as PIXI from "pixi.js";

export async function init() {
    await PIXI.Assets.load("/assets/sprite.jpg");
    await PIXI.Assets.load("/assets/back.png");
    await PIXI.Assets.load("/assets/refresh-arrow.svg");
}