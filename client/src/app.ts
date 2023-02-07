import { Connection } from "./websocket/Connection";
import { engine } from "./websocket/engine";
import * as PIXI from "pixi.js";
import { GameField } from "./GameFields";
import { renderCards, addCardInGameField, createSuitsImages, getFields } from "./utils/Factory";
import { gsap, random, shuffle } from "gsap";
import { field, field1, field2, field3 } from "./utils/gameField";
import { Tank } from "./Tank";
import { Card } from "./Card";
import { TextArea } from "./utils/TextArea";
import { WINDOW_HEIGHT, WINDOW_WIDTH } from "./utils/constants";
import { dealCards, shuffleCards } from "./animations";


const initForm = document.querySelector('form');
const initSection = document.getElementById('init');
const gameSection = document.getElementById('game');

let connection = null;

initForm.addEventListener('submit', async event => {
    event.preventDefault();
    const { nickname } = Object.fromEntries(new FormData(event.target as HTMLFormElement));

    connection = new Connection(nickname as string);
    await connection.open();
    engine(connection);
    showBoard();

    connection.send('startGame');
});

document.getElementById('disconnect').addEventListener('click', () => {
    connection?.disconnect();
    showInit();
});

function showBoard() {
    initSection.style.display = 'none';
    //gameSection.style.display = 'block';
    onStart();
}

function showInit() {
    initSection.style.display = 'block';
    gameSection.style.display = 'none';


}






// add canvas
const app = new PIXI.Application({
    background: "0x006E33",
    width: window.innerWidth,
    height: window.innerHeight,
});

function onStart() {
    document.body.appendChild(app.view as HTMLCanvasElement);
    // Dependency Injection ???
    const container = new Tank(100, 100);
    //let cards = renderCards(app, container);

    let cards = renderCards(app, onClick);
    const suites = createSuitsImages();
    let fields: GameField[] = [];
    const flipContainer = new Tank(300, 100);
    const tl = gsap.timeline();

    async function init() {
        await PIXI.Assets.load("/assets/sprite.jpg");
        await PIXI.Assets.load("/assets/back.png");
    }

    cards.forEach(c => {
        container.add(c);
        c.position.set(100, 150);
    })


    init().then(start)
        .then(() => shuffleCards(cards))
        .then(() => dealCards(cards, fields, app))


    async function start() {
        fields = getFields();
        let score = new TextArea('Score: ');
        let time = new TextArea('Time: 0.0');
        app.stage.addChild(field, field1, field2, field3, ...fields, container, flipContainer, score, time);
        score.position.set(WINDOW_WIDTH - 300, 30);
        time.position.set(WINDOW_WIDTH - 100, 30);
        return fields;

    }

    function onClick() {
        const current = container.cards[container.cards.length - 1];
        container.remove(current);
        current.onStart = true;
        flipContainer.add(current);
        current._parent = flipContainer


    }

    function onMove() {

    }

}