import { GameField } from "../GameFields";
import { createSuitsImages, } from "../utils/Factory";

const suites = createSuitsImages();
const field = new GameField(850, 30, 120, 150, "H", suites[0]); // hearts
const field1 = new GameField(1100, 30, 120, 150, "S", suites[1]); // spades
const field2 = new GameField(1350, 30, 120, 150, "D", suites[2]); // diamond
const field3 = new GameField(1600, 30, 120, 150, "C", suites[3]); // club

export {
    field,
    field1,
    field2,
    field3
}
