import { GameField } from "../GameFields";
import { createSuitsImages, } from "../utils/Factory";
import { CARD_HEIGHT, CARD_WIDTH, WINDOW_WIDTH } from "./constants";

const suites = createSuitsImages();

const field = new GameField(1, WINDOW_WIDTH / 7 * 3 + 50, 70,[],'foundation',null, "spades", suites[3]); // hearts
const field1 = new GameField(2, WINDOW_WIDTH / 7 * 4 + 50, 70,[],'foundation',null, "hearts", suites[0]); // spades
const field2 = new GameField(3, WINDOW_WIDTH / 7 * 5 + 50, 70,[], 'foundation',null,"clubs", suites[1]); // diamond
const field3 = new GameField(4, WINDOW_WIDTH / 7 * 6 + 50, 70,[], 'foundation',null, "diamonds", suites[2]); // club

export {
    field,
    field1,
    field2,
    field3
}

export function getFoundations() {
    let foundations = [field, field1, field2, field3];
    return foundations;
}
