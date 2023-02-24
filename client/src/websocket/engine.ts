import { Connection } from "./Connection";
import * as PIXI from "pixi.js";
import { GameField } from "../GameFields";
import { init } from "../utils/Loader";
import { App } from "../Application";
import { CARD_HEIGHT, CARD_WIDTH, offset } from "../utils/constants";
import {
  dealCards,
  flipCard,
  moveCard,
  selectCard,
  shuffleCards,
} from "../animations";
import { Card } from "../Card";

export function engine(connection: Connection) {
  let state: any = {};
  let moves = null;
  let previousMove = null;
  let previousCard = null;
  let successMove = false;
  let lastIndex = -1;

  function onMoves(receivedMoves) {
    moves = receivedMoves;
    console.log("received moves", moves);
  }

  function onState(receivedState) {
    console.log("received state", receivedState);
    state = receivedState;
    onStart(state);
  }

  function onVictory() {
    alert("Victory!");
    connection.send("newGame");
  }

  connection.on("state", onState);
  connection.on("moves", onMoves);
  connection.on("victory", onVictory);

  function onStart(state) {
    connection.on("moveResult", onResult);

    const application = new App(state, onPlace);
    console.log("piles: ", application.piles);

    application.isActive = true;
    document.body.appendChild(application.view as HTMLCanvasElement);

    init();
    function onResult(data) {
      if (application.state.stock.cards.length == 0) {
        console.log("console.log")
      }
      console.log(application.stock.sprites);
      if (data == null) {



        // let wasteCards = JSON.parse(
        //   JSON.stringify(application.waste.cards.reverse())
        // );
        // application.state.stock.cards = wasteCards;
        // application.stock.cards = wasteCards;

        // application.stock.sprites = [...application.waste.sprites.reverse()];
        // application.stock.addChild(...application.stock.sprites);
        // application.state.waste.cards = [];
        // application.stock.sprites.forEach((b) => b.renderable = true)
        // application.waste.sprites = [];
        // application.waste.cards = []
        // application.stock.sprites.forEach((s) => {
        //   s.faceUp = false;
        //   s.sprite.renderable = false;
        // });
        // application.stock.cards.forEach((c) => c.faceUp = false);        
        //application.waste.removeChildren()
      } else {
        if (previousMove != null) {
          if (previousMove.action == "flip") {
            //flip waste
            if (previousMove.source == "stock") {
              if (application.state.stock.cards.length > 0 && data != null) {
                const currentCard = application.sprites.find(
                  (s) => s.face == data.face && s.suite == data.suit
                );

                application.waste.cards.forEach((c) => c.faceUp = true);

                const newCard = application.stock.sprites.pop();
                newCard.sprite = currentCard.sprite;
                newCard.power = data.face;
                newCard.suite = data.suit;
                newCard.flip()

                application.waste.sprites.push(newCard);
                application.waste.addChild(newCard);
                application.waste.cards.push(data)
                application.stock.removeChild(newCard);
                application.stock.cards.pop();


                if (application.stock.cards.length == 0) {

                  application.stock.cards = application.waste.cards.slice().reverse();
                  application.stock.sprites = application.waste.sprites.slice().reverse();
                  application.state.stock.cards.push(...(state.waste.cards).slice().reverse());
                  application.state.waste.cards = [];
                  application.stock.addChild(...application.stock.sprites);
                  application.waste.removeChild(...application.waste.sprites);
                  application.stock.sprites.forEach(s => {
                    s.setBack();
                  });

                  application.waste.cards = [];
                  application.waste.sprites = [];

                }


              } else if (
                application.state.stock.cards.length == 0 &&
                application.state.waste.cards.length > 0
              ) {

                // application.stock.cards = application.waste.cards.slice().reverse();

                // application.stock.sprites = application.waste.sprites.slice().reverse();
                // console.log(application.stock.cards)
                // application.waste.cards = [];
                // application.waste.sprites = [];
                // application.state.waste.cards.reverse();
                // application.state.stock.cards.push(...(state.waste.cards).slice());
                // application.state.waste.cards = [];
                // application.stock.addChild(... application.stock.sprites);
                // application.waste.removeChild(...application.stock.sprites)


                // application.stock.sprites = application.waste.sprites.slice().reverse();
                // application.waste.cards = [];
                // application.waste.sprites = [];
                // application.state.waste.cards.reverse();
                // application.state.stock.cards.push(...state.waste.cards);
                // application.state.stock.cards.forEach(
                //   (c) => (c.faceUp = false)
                // );
                // application.state.waste.cards.length = 0;
                // // application.stock.cards = application.waste.cards
                // //   .slice()
                // //   .reverse();

                // // application.stock.cards = application.waste.cards.reverse();
                // // application.waste.cards = [];

                // application.stock.sprites = application.waste.sprites.reverse();
                // application.waste.sprites = [];
              }
            } else {
              //flip pile
              const currentCard = application.sprites.find(
                (s) => s.face == data.face && s.suite == data.suit
              );
              const currentField = application.piles.find(
                (f) => f.type === previousMove.source
              );

              const lastCurrentFieldSprite = currentField.sprites[currentField.sprites.length - 1];
              lastCurrentFieldSprite.position.set(0, (currentField.sprites.length - 1) * offset);

              lastCurrentFieldSprite.sprite = currentCard.sprite;
              currentField.cards[currentField.cards.length - 1] = data;
              lastCurrentFieldSprite.flip()


            }
            previousMove = null;
          } else if (previousMove.action == "place") {
            if (data) {
              if (previousMove.source == "stock") {
                //target pile
                if (previousMove.target.includes("pile")) {
                  let currentCard =
                    application.waste.cards[application.waste.cards.length - 1];
                  const lastSprite = application.waste.sprites[application.waste.sprites.length - 1];
                  let target = application.piles.find(
                    (f) => f.type == previousMove.target
                  );

                  target.addChild(lastSprite);
                  target.sprites.push(lastSprite);

                  if (target.sprites.length > 0) {

                    lastSprite.position.set(0, target.cards.length * offset);
                  } else {
                    lastSprite.position.set(0);
                  }
                  target.cards.push(currentCard);
                  application.waste.cards.splice(application.waste.cards.length - 1, 1);
                  application.waste.sprites.splice(application.waste.sprites.length - 1, 1);
                  application.score.increaceScore();
                } else {
                  //target foundation
                  let currentCard =
                    application.waste.cards[application.waste.cards.length - 1];
                  let target = application.foundations.find(
                    (f) => f.suite == previousMove.target
                  );

                  target.cards.push(currentCard);
                  const sprite = application.sprites.find(
                    (s) =>
                      currentCard.face == s.face && currentCard.suit === s.suite
                  );
                  target.addChild(sprite.sprite);
                  application.waste.removeChild(sprite.sprite);
                  application.waste.cards.splice(
                    application.waste.cards.length - 1,
                    1
                  );
                  application.score.increaceScore();
                }
              } else {
                if (previousMove.source.includes("pile")) {
                  //target pile
                  if (previousMove.target.includes("pile")) {

                    let previousField = application.piles.find(
                      (f) => f.type == previousMove.source
                    );

                    let targetField = application.piles.find(
                      (f) => f.type == previousMove.target
                    );

                    let cardsOnMove = previousField.cards.slice(Number(previousMove.index));
                    const currentSprites = previousField.sprites.slice(previousMove.index);
                    previousField.cards.splice(Number(previousMove.index), cardsOnMove.length);

                    previousField.sprites.splice(Number(previousMove.index), cardsOnMove.length);


                    currentSprites.forEach(s => {

                      previousField.removeChild(s);
                      targetField.addChild(s);
                      if (targetField.sprites.length > 0) {
                        s.position.set(0, targetField.sprites.length * offset);
                        console.log(targetField.sprites.length)
                      } else {
                        s.position.set(0, 0);

                      }
                      targetField.sprites.push(s);

                    });
                    targetField.cards.push(...cardsOnMove);
                    application.score.increaceScore();
                  } else {
                    //target -foundation
                    let currentField = application.piles.find(
                      (f) => f.type == previousMove.source
                    );
                    previousCard =
                      currentField.cards[Number(previousMove.index)];
                    let targetField = application.foundations.find(
                      (f) => f.suite == previousMove.target
                    );
                    let currentSprite = currentField.sprites.pop();
                    targetField.cards.push(previousCard);
                    targetField.sprites.push(currentSprite);
                    targetField.addChild(currentSprite);
                    currentField.cards.splice(Number(previousMove.index), 1);

                    currentSprite.position.set(0, 0);
                    application.score.increaceScore();
                  }
                }
              }
              successMove = true;
            }
            previousMove = null;
          }
        }
      }
    }

    function onPlace(e: PIXI.FederatedMouseEvent) {
      console.log(previousMove);
      let move = null;

      let target = e.target as GameField;
      if (!(target as GameField)?.cards) {
        target = e.target?.parent as GameField;
      }
      let cardIndex = ((e.target as Card).index);

      const type = target.type;
      if (target.type === 'stock' && target.id == 0) {
        console.log(target.cards.indexOf(target.cards[target.cards.length - 1]))
        move = {
          action: "flip",
          source: "stock",
          target: null,
          index: cardIndex,
        }
      } else if (target.id == -1 && target.type == 'stock' && target.cards.length > 0) {
        const lastCard = target.cards[target.cards.length - 1];

        if (lastCard) {
          move = {
            action: "take",
            source: target.type,
            target: null,
            index: target.cards.indexOf(lastCard),
          }
          lastCard.faceUp = true;
        }

      }

      else if (type.includes('pile')) {
        let lastCard = target.cards[target.cards.length - 1];
        if (lastCard) {

          if (lastCard.faceUp == false && previousMove == null) {
            move = {
              action: "flip",
              source: target.type,
              target: null,
              index: target.cards.indexOf(lastCard),
            }
            lastCard.faceUp = true;
          } else {
            if (lastCard.faceUp == true && previousMove == null) {
              let last = target.cards[target.cards.length - 1];
              let cards = []
              target.cards.map(c => {

                if (c.faceUp == true) {
                  cards.push(c)
                }
              })

              move = {
                action: "take",
                source: target.type,
                target: null,
                index: cardIndex
              }


            } else if (lastCard.faceUp && previousMove != null) {
              let indexTrue;
              let validMoves = {};
              moves.piles.find((p, i) => {
                if (p.place == true) {
                  indexTrue = i;
                  validMoves[i] = p
                }
              });
              let indexField = target.type.substring(4);

              if (

                (validMoves[indexField])

              ) {

                move = {
                  action: "place",
                  source: previousMove.source,
                  target: target.type,
                  index: previousMove.index,
                };
              } else {
                //let cards = target.cards.map(c => c.faceUp == true);
                let cards = []
                target.cards.map(c => {

                  if (c.faceUp == true) {
                    cards.push(c)
                  }
                })

                move = {
                  action: "take",
                  source: target.type,
                  target: null,
                  index: cardIndex,
                }

              }
            }
          }
        } else {
          move = {
            action: "place",
            source: previousMove.source,
            target: target.type,
            index: previousMove.index,
          };
        }

      } else if (type == 'foundation') {
        let indexTrue;
        moves.piles.find((p, i) => {
          if (p.place == true) {
            indexTrue = i;
          }
        });
        if (
          (Number(type) === indexTrue && target.type == "stock") ||
          (Number(type) == indexTrue && target.type.includes("pile")) ||
          target.type == "foundation"
        ) {
          move = {
            action: "place",
            source: previousMove.source,
            target: `${target.suite}`,
            index: previousMove.index,
          }
        };
      }


      if (move) {
        previousMove = move;
        connection.send('move', move);
      }
    }
  }
}
