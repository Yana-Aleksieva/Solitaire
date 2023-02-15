import { Connection } from "./Connection";
import * as PIXI from "pixi.js";
import { GameField } from "../GameFields";
import { init } from "../utils/Loader";
import { App } from "../Application";

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

  // connection.on("victory", onVictory);

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
            if (state.stock.cards.length > 0 && data != null) {
              state.stock.cards.splice(state.stock.cards.length - 1, 1);
              console.log(state.stock.cards.length);
              state.waste.cards.push(data);
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
              state.stock.cards.length == 0 &&
              state.waste.cards.length > 0
            ) {
              state.waste.cards.reverse();
              state.stock.cards.push(...state.waste.cards);
              state.stock.cards.forEach((c) => (c.faceUp = false));
              state.waste.cards.length = 0;
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
            //currentField.cards.push(data);
            console.log(currentField);
            currentCard.sprite.position.set(
              0,
              (currentField.cards.length - 1) * 40
            );
          }
          previousMove = null;
        } else if (previousMove.action == "take") {
        } else if (previousMove.action == "place") {
          if (data) {
            let validMoves = null;
            console.log(previousMove.source == "stock");
            if (previousMove.source == "stock") {
              validMoves = data;
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
              application.waste.removeChild(sprite.sprite);
              application.waste.cards.splice(
                application.waste.cards.length - 1,
                1
              );
            } else {
              let currentField = application.piles.find(
                (f) => f.type == previousMove.source
              );
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
              currentSprite.sprite.position.set(
              0,
              targetField.cards.length * 40
              );
            }
          }
          previousMove = null;
        }
      }
    }

    function onPlace(e: PIXI.FederatedMouseEvent) {
      let move = null;
      //const f = e.target as GameField;
      let target = e.target as GameField;
      if (target.type == "foundation") {
        const type = e.target as GameField;
        const foundation = application.foundations.find(
          (f) => f.suite == type.suite
        );

        try {
          const isFoundFlipContainer = addFromFlipContainer(
            foundation,
            type.suite
          );
          if (!isFoundFlipContainer) {
            addFromGameField(foundation);
          }
          let move = {
            action: "place",
            source: previousMove.source,
            target: `${type.suite}`,
            index: previousMove.index,
          };
          connection.send("move", move);
        } catch (error) {
          console.log(error.message);
        }
      } else {
        if (target.cards.length == 0 && target.type == "stock") {
          move = {
            action: "flip",
            source:"stock",
            target: null,
            index: null,
          }
        } else {
          let lastCard = target.cards[target.cards.length - 1];
          if (!lastCard || lastCard.faceUp == true) {
            let indexTrue;
            moves.piles.find((p, i) => {
              if (p.place == true) {
                indexTrue = i;
              }
            });
            let type = target.type.substring(4);
            if (
              (Number(type) === indexTrue && target.type == "stock") ||
              (Number(type) == indexTrue && target.type.includes("pile")) ||
              target.type == "foundation"
            ) {
              move = {
                action: "place",
                source: previousMove.source,
                target: target.type,
                index: previousMove.index,
              };
              // let target = fields.find(f => f.type == move.source);
              // let source = fields.find(f => f.type == previousMove.source);
              // console.log(target, source);
            } else {
              move = {
                action: "take",
                source: `${target.type}`,
                target: null,
                index: target.cards.indexOf(lastCard),
              };
            }
          } else if (lastCard && !lastCard.faceUp) {
            move = {
              action: "flip",
              source: target.type,
              target: null,
              index: target.cards.indexOf(lastCard),
            };
          }
        }

        previousMove = move;
        connection.send("move", move);
      }

      function addFromFlipContainer(f: GameField, clickedFieldSuit: string) {
        if (application.waste.cards.length == 0) {
          return false;
        }

        const card =
          application.waste.cards[application.waste.cards.length - 1];
        const currentCard = application.sprites.find(
          (s) => s.face == card.face && s.suite == card.suit
        );
        application.waste.cards.splice(application.waste.cards.length - 1, 1);
        if (
          f.cards.length == 0 &&
          currentCard.suite == clickedFieldSuit &&
          currentCard.face == 1
        ) {
          f.addChild(currentCard.sprite);
          f.cards.push(currentCard);
          return true;
        } else if (currentCard.suite == clickedFieldSuit) {
          const lastCardField = f.cards[f.cards.length - 1];
          if (lastCardField && currentCard.power == lastCardField.power + 1) {
            f.addChild(currentCard.sprite);
            f.cards.push(currentCard);
            return true;
          } else {
            throw new Error("Not found!");
          }
        }
        return false;
      }

      function addFromGameField(f: GameField) {
        const indexField = Number(previousMove.source[4]);
        const currentField = application.piles[indexField];
        const lastCard = currentField.cards[currentField.cards.length - 1];
        const card = application.sprites.find(
          (c) => c.face == lastCard.face && c.suite == lastCard.suit
        );
        card.sprite.position.set(0);
        f.cards.push(card);
        f.addChild(card.sprite);
      }
    }
  }
}
