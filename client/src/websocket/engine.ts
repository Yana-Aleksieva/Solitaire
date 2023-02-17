import { Connection } from "./Connection";
import * as PIXI from "pixi.js";
import { GameField } from "../GameFields";
import { init } from "../utils/Loader";
import { App } from "../Application";
import { CARD_HEIGHT } from "../utils/constants";

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
      if (data == null) {
        console.log("null");
        //reverseStock();
      }

      if (previousMove != null) {
        if (previousMove.action == "flip") {
          if (previousMove.source == "stock") {
            console.log(state.stock.cards.length);
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
            currentCard.sprite.position.set(
              0,
              (currentField.cards.length - 1) * 40);
          }
          previousMove = null;
        } else if (previousMove.action == "take") {
        } else if (previousMove.action == "place") {
          if (data) {


            if (previousMove.source == "stock") {
              if (previousMove.target.includes('pile')) {
                let currentCard =
                  application.waste.cards[application.waste.cards.length - 1];
                let target = application.piles.find(
                  (f) => f.type == previousMove.target
                );
                target.cards.push(currentCard);
                const sprite = application.sprites.find(
                  (s) =>
                    currentCard.face == s.face && currentCard.suit === s.suite
                );
                target.addChild(sprite.sprite);
                console.log(previousMove.source == "stock");
                if (target.cards.length > 0) {
                  sprite.sprite.position.set(0, target.cards.length * 40)
                } else {
                  sprite.sprite.position.set(0)
                }

                application.waste.removeChild(sprite.sprite);
                application.waste.cards.splice(
                  application.waste.cards.length - 1, 1);
              } else {
                let currentCard =
                  application.waste.cards[application.waste.cards.length - 1];
                let target = application.foundations.find(
                  (f) => f.suite == previousMove.target
                );
                console.log(target.cards)
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
              }

            } else {
              if (previousMove.source.includes('pile')) {
                if (previousMove.target.includes('pile')) {
                  let currentField = application.piles.find(
                    (f) => f.type == previousMove.source
                  );
                  let cardsFaceUp = currentField.cards.map(card => card.faceUp == true);
                  console.log(currentField.cards)
                  previousCard = currentField.cards[Number(previousMove.index)];
                  let targetField = application.piles.find(
                    (f) => f.type == previousMove.target
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
                  console.log(targetField);
                  currentSprite.sprite.position.set(0,targetField.cards.length * 40);


                } else {
                  //target -foundation
                  console.log(application.foundations)
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
                  console.log(targetField)
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
            //console.log(previousMove.action)
          } else {
            console.log(previousMove, target.cards, lastCard, target.cards.indexOf(lastCard))

            if (lastCard.faceUp == true && previousMove == null) {
              let last = target.cards[target.cards.length - 1];
           

              move = {
                action: "take",
                source: target.type,
                target: null,
                index: target.cards.indexOf(last)
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
              console.log(validMoves, 'valid moves')
                move = {
                  action: "place",
                  source: previousMove.source,
                  target: target.type,
                  index: previousMove.index,
                };
              } else {
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

      // function addFromFlipContainer(f: GameField, clickedFieldSuit: string) {
      //   if (application.waste.cards.length == 0) {
      //     return false;
      //   }

      //   const card =
      //     application.waste.cards[application.waste.cards.length - 1];
      //   const currentCard = application.sprites.find(
      //     (s) => s.face == card.face && s.suite == card.suit
      //   );
      //   application.waste.cards.splice(application.waste.cards.length - 1, 1);
      //   if (
      //     f.cards.length == 0 &&
      //     currentCard.suite == clickedFieldSuit &&
      //     currentCard.face == 1
      //   ) {
      //     f.addChild(currentCard.sprite);
      //     f.cards.push(currentCard);
      //     return true;
      //   } else if (currentCard.suite == clickedFieldSuit) {
      //     const lastCardField = f.cards[f.cards.length - 1];
      //     if (lastCardField && currentCard.power == lastCardField.power + 1) {
      //       f.addChild(currentCard.sprite);
      //       f.cards.push(currentCard);
      //       return true;
      //     } else {
      //       throw new Error("Not found!");
      //     }
      //   }
      //   return false;
      // }

      // function addFromGameField(f: GameField) {
      //   const indexField = Number(previousMove.source[4]);
      //   const currentField = application.piles[indexField];
      //   const lastCard = currentField.cards[currentField.cards.length - 1];
      //   const card = application.sprites.find(
      //     (c) => c.face == lastCard.face && c.suite == lastCard.suit
      //   );
      //   card.sprite.position.set(0);
      //   f.cards.push(card);
      //   f.addChild(card.sprite);
      // }
    }
  }
}
