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
                //application.flip(currentCard.sprite, application.backs[application.backs.length-1])
                //application.waste.addChild(currentCard.sprite);
                application.waste.cards.forEach((c) => c.faceUp = true);
                const newCard = application.stock.sprites[application.stock.sprites.length - 1];
                newCard.position.set(0, 0);
                newCard.sprite = currentCard.sprite;
                newCard.power = currentCard.face;
                newCard.suite = data.suit;
                newCard.sprite.renderable = true;
                application.waste.sprites.push(newCard);
                application.waste.addChild(newCard);
                if (application.stock.children.length > 2) {
                  application.stock.removeChild(
                    application.stock.children[
                    application.stock.children.length - 1
                    ]
                  );
                }

                if (application.stock.children.length == 1) {
                  application.stock.sprites.splice(application.stock.sprites.length - 1, 1);
                }
                application.state.waste.cards.push(data);
                application.state.stock.cards.splice(
                  application.state.stock.cards.length - 1,
                  1
                );
              } else if (
                application.state.stock.cards.length == 0 &&
                application.state.waste.cards.length > 0
              ) {
                application.state.waste.cards.reverse();
                application.state.stock.cards.push(...state.waste.cards);
                application.state.stock.cards.forEach(
                  (c) => (c.faceUp = false)
                );
                application.state.waste.cards.length = 0;
                // application.stock.cards = application.waste.cards
                //   .slice()
                //   .reverse();
                
                  // application.stock.cards = application.waste.cards.reverse();
                  // application.waste.cards = [];
          
                  application.stock.sprites = application.waste.sprites.reverse();
                  application.waste.sprites = [];
              }
            } else {
              //flip pile
              const currentCard = application.sprites.find(
                (s) => s.face == data.face && s.suite == data.suit
              );
              const currentField = application.piles.find(
                (f) => f.type === previousMove.source
              );
              //flipCard(currentCard.sprite, currentField.children[currentField.children.length - 1])
              // currentField.removeChild(
              //   currentField.children[currentField.children.length - 1]
              // );
              const lastCurrentFieldSprite =  currentField.sprites[currentField.sprites.length - 1];
              lastCurrentFieldSprite.position.set(0, (currentField.sprites.length - 1) * offset)
              lastCurrentFieldSprite.sprite = currentCard.sprite;

              //currentField.addChild(currentCard.sprite);
              currentField.cards[currentField.cards.length - 1] = data;
              // currentCard.sprite.position.set(
              //   0,
              //   (currentField.sprites.length - 1) * offset
              // );
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
                  const sprite = application.sprites.find(
                    (s) =>
                      currentCard.face == s.face && currentCard.suit === s.suite
                  );
                  // moveCard(sprite.sprite, target)
                  
                  
                  if (target.sprites.length > 0) {
                    console.log(target.sprites.length);
                    console.log(target.sprites.length * offset)
                    sprite.sprite.position.set(0, target.sprites.length * offset);
                  } else {
                    sprite.sprite.position.set(0, 0);
                  }
                  target.cards.push(currentCard);
                  target.addChild(lastSprite);
                  target.sprites.push(lastSprite);
                  application.waste.removeChild(sprite.sprite);
                  application.waste.cards.splice(
                    application.waste.cards.length - 1,
                    1
                  );
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
                    let currentField = application.piles.find(
                      (f) => f.type == previousMove.source
                    );
                    const sprites = [];
                    previousCard = currentField.cards[Number(previousMove.index)];
                    let cardsFaceUp = currentField.sprites.slice(
                      Number(previousMove.index)
                    );
                    console.log(previousMove.index);
                    console.log(cardsFaceUp);
                    let targetField = application.piles.find(
                      (f) => f.type == previousMove.target
                    );
                    // let currentSprite = application.sprites.find((s) =>
                    //   cardsFaceUp.forEach((card) => {
                    //     if (card.face === s.face && card.suit === s.suite) {
                    //       sprites.push(s);
                    //     }
                    //   })
                    // );
                    let sorted = cardsFaceUp;
                      // .slice()
                      // .sort((a, b) => Number(b.face) - Number(a.face));
                    console.log(sorted);

                    let index = 0;
                    sorted.forEach((s) => {
                      if (targetField.sprites.length > 0) {
                        console.log(targetField.sprites.length);
                        console.log(targetField.sprites.length * offset)
                        s.position.set(
                          0,
                          (targetField.sprites.length) * offset
                        );
                        console.log(targetField.sprites);
                      } else if (targetField.sprites.length == 0) {
                        //  // targetField.addChild(s.sprite)
                        s.position.set(0, 0);
                      }

                      targetField.cards.push(currentField.cards[index]);
                      targetField.addChild(s);
                      currentField.removeChild(s);
                      targetField.sprites.push(s);
                      index++;
                    });                    

                    

                    currentField.cards.splice(
                      Number(previousMove.index),
                      cardsFaceUp.length
                    );

                    currentField.sprites.splice(
                      Number(previousMove.index),
                      cardsFaceUp.length
                    );

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
                    let currentSprite = application.sprites.find(
                      (s) =>
                        previousCard.face === s.face &&
                        previousCard.suit === s.suite
                    );
                      console.log(targetField);
                    //currentField.removeChild(currentSprite.sprite);
                   // targetField.addChild(currentSprite.sprite);
                    targetField.cards.push(previousCard);
                    targetField.sprites.push(currentField.sprites[previousMove.index]);
                    targetField.addChild(currentField.sprites[previousMove.index]);
                    currentField.cards.splice(Number(previousMove.index), 1);
                    currentField.sprites.splice(Number(previousMove.index), 1);
                    currentSprite.sprite.position.set(0, 0);
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
      if (!(target as GameField)?.cards ) {
        target = e.target?.parent as GameField;
      }
      // let target = e.target.parent as GameField;
      // if ((e.target as GameField).type == "foundation") {
      //   target = e.target as GameField;
      // }

      const type = target.type;
      if (target.type === 'stock' && target.id == 0) {
        move = {
          action: "flip",
          source: "stock",
          target: null,
          index: target.cards.indexOf(target.cards[target.cards.length - 1]),
        }
      } else if (type.includes('pile')) {
        let lastCard = target.cards[target.cards.length - 1];
        if (lastCard) {

          if (lastCard.faceUp == false) {
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
                index: target.cards.indexOf(cards[0])
              }
              console.log(cards)

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
                let cards = target.cards.map(c => c.faceUp == true);

                move = {
                  action: "take",
                  source: target.type,
                  target: null,
                  index: target.cards.indexOf(lastCard),
                }
                console.log(cards)
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

      } else if (target.id == -1) {
        const lastCard = target.cards[target.cards.length - 1];
        const sprite = application.findSprite(lastCard);

        if (lastCard) {
          move = {
            action: "take",
            source: target.type,
            target: null,
            index: target.cards.indexOf(lastCard),
          }
          console.log(lastCard)
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
        connection.send('move', move);
        previousMove = move;
      }
    }
  }
}
