import { Connection } from "./Connection";
import * as PIXI from "pixi.js";
import { GameField } from "../GameFields";
import { init } from "../utils/Loader";
import { App } from "../Application";
import { CARD_HEIGHT, offset } from "../utils/constants";

export function engine(connection: Connection) {
  let state: any = {};
  let moves = null;
  let previousMove = null;
  let previousCard = null;

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
    document.body.appendChild(application.view as HTMLCanvasElement);

    init();
    function onResult(data) {


      if (previousMove != null) {
        if (previousMove.action == "flip") {
          //flip waste
          if (previousMove.source == "stock") {

            if (application.state.stock.cards.length > 0 && data != null) {
              application.state.stock.cards.splice(state.stock.cards.length - 1, 1);
              application.state.waste.cards.push(data);
              const currentCard = application.sprites.find(
                (s) => s.face == data.face && s.suite == data.suit
              );

              application.waste.addChild(currentCard.sprite);
              application.stock.removeChild(
                application.stock.children[
                application.stock.children.length - 1
                ]
              );
            } else if (
              data == null &&
              application.state.stock.cards.length == 0 &&
              application.state.waste.cards.length > 0
            ) {
              application.state.waste.cards.reverse();
              application.state.stock.cards.push(...state.waste.cards);
              application.state.stock.cards.forEach((c) => (c.faceUp = false));
              application.state.waste.cards.length = 0;
              application.stock.cards = application.waste.cards
                .slice()
                .reverse();
            }
          } else {
            //flip pile
            const currentCard = application.sprites.find(
              (s) => s.face == data.face && s.suite == data.suit
            );
            const currentField = application.piles.find(
              (f) => f.type === previousMove.source
            );
            currentField.removeChild(
              currentField.children[currentField.children.length - 1]
            );

            currentField.addChild(currentCard.sprite);
            currentField.cards[currentField.cards.length - 1] = data;
            currentCard.sprite.position.set(0, (currentField.cards.length - 1) * offset);
          }
          previousMove = null;
        } else if (previousMove.action == "place") {
          if (data) {

            if (previousMove.source == "stock") {
              //target pile
              if (previousMove.target.includes('pile')) {
                let currentCard =
                  application.waste.cards[application.waste.cards.length - 1];
                let target = application.piles.find(
                  (f) => f.type == previousMove.target
                );

                const sprite = application.sprites.find(
                  (s) =>
                    currentCard.face == s.face && currentCard.suit === s.suite
                );

                target.addChild(sprite.sprite);
                if (target.cards.length > 0) {
                  sprite.sprite.position.set(0, target.cards.length * offset);
       
                } else {
                  sprite.sprite.position.set(0, 0);
                }

                target.cards.push(currentCard);
                application.waste.removeChild(sprite.sprite);
                application.waste.cards.splice(
                  application.waste.cards.length - 1, 1);
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
                  application.waste.cards.length - 1, 1);
              }

            } else {
              if (previousMove.source.includes('pile')) {
                //target pile

                if (previousMove.target.includes('pile')) {
                  let currentField = application.piles.find(
                    (f) => f.type == previousMove.source
                  );

                 const sprites = [];
                  previousCard = currentField.cards[Number(previousMove.index)];
                  let cardsFaceUp = currentField.cards.slice(Number(previousMove.index));
                  let targetField = application.piles.find(
                    (f) => f.type == previousMove.target
                  );
                  let currentSprite = application.sprites.find(
                    (s) =>

                      cardsFaceUp.forEach(card => {
                        if (card.face === s.face && card.suit === s.suite) {
                          sprites.push(s);
                        }

                      })
                  );
                  let sorted = sprites.slice().sort((a, b) => Number(b.face) - Number(a.face));
                  currentField.cards.splice(Number(previousMove.index), cardsFaceUp.length);

                  let index = 0;
                  sorted.forEach(s => {
                   
                    targetField.addChild(s.sprite)

                    if (targetField.cards.length > 0) {

                      s.sprite.position.set(0, targetField.cards.length * offset);
                    } else if (targetField.cards.length == 0) {
                      //  // targetField.addChild(s.sprite)
                      s.sprite.position.set(0, 0)
                    }
                    targetField.cards.push(cardsFaceUp[index]);
                    currentField.removeChild(s.sprite);
                    index++;
                  });



                } else {
                  //target -foundation

                  let currentField = application.piles.find(
                    (f) => f.type == previousMove.source
                  );
                  previousCard = currentField.cards[Number(previousMove.index)];
                  let targetField = application.foundations.find(
                    (f) => f.suite == previousMove.target
                  );
                  let currentSprite = application.sprites.find(
                    (s) =>
                      previousCard.face === s.face && previousCard.suit === s.suite
                  );

                  currentField.removeChild(currentSprite.sprite);
                  currentField.cards.splice(Number(previousMove.index), 1);
                  targetField.addChild(currentSprite.sprite);
                  targetField.cards.push(previousCard);
                  currentSprite.sprite.position.set(0, 0);

                }
              }

            }
          }
          previousMove = null;
        }
      }
    }



    function onPlace(e: PIXI.FederatedMouseEvent) {

      let move = null;
      let target = e.target as GameField;
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
        if (lastCard) {
          move = {
            action: "take",
            source: target.type,
            target: null,
            index: target.cards.indexOf(lastCard),
          }
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
      previousMove = move;
      connection.send('move', move);


    }
  }
}
