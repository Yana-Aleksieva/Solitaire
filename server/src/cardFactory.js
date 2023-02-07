import { Deck, Stack, stacks, suits } from './cards.js';


/**
 * @typedef {Object} GameState
 * @property {Stack} stock,
 * @property {Stack} waste,
 * @property {{[suit: string]: Stack}} foundations,
 * @property {[Stack, Stack, Stack, Stack, Stack, Stack, Stack]} piles,
 */

/**
 * 
 * @returns {GameState}
 */
export function createState() {
    return {
        stock: createStock(),
        waste: createWaste(),
        foundations: {
            [suits.Clubs]: createFoundation(suits.Clubs),
            [suits.Diamonds]: createFoundation(suits.Diamonds),
            [suits.Hearts]: createFoundation(suits.Hearts),
            [suits.Spades]: createFoundation(suits.Spades),
        },
        piles: [
            createPile(),
            createPile(),
            createPile(),
            createPile(),
            createPile(),
            createPile(),
            createPile(),
        ]
    };
}

/**
 * 
 * @param {Deck} deck 
 * @param {GameState} state 
 */
export function dealDeckToState(deck, state) {
    for (let pileIndex = 0; pileIndex < 7; pileIndex++) {
        for (let cardIndex = 0; cardIndex <= pileIndex; cardIndex++) {
            state.piles[pileIndex].cards.push(deck.deal());
        }
        state.piles[pileIndex].top.faceUp = true;
    }
    state.stock.cards.push(...deck.cards);
}

/**
 * 
 * @returns {Stack}
 */
function createStock() {
    return new Stack(stacks.Stock);
}

/**
 * 
 * @returns {Stack}
 */
function createWaste() {
    return new Stack(stacks.Waste);
}

/**
 * 
 * @returns {Stack}
 */
function createPile() {
    return new Stack(stacks.Pile);
}

/**
 * 
 * @param {keyof suits} suit 
 * @returns {Stack}
 */
function createFoundation(suit) {
    return new Stack(stacks.Foundation, suit);
}