import { useState } from "react";
import React = require("react");
import ReactDOM = require("react-dom");
import GamePieces from "./gamePieces";
import server from "./server";
import Game from "./server/Game";

function blockGame({ server }: { server: server }) {
  const [game, setGame] = useState<Game | undefined>();

  const startGame = () => {
    setGame(server.newGame());
  }



  return (
    <div>
      <header>
        <h1>Block Game</h1>
      </header>
      <button
        className="btn-primary"
        disabled={!!game}
        data-new-game onClick={startGame}>
        New Game
      </button>
      {
        game && <div className="game-container">
          <div data-game-board>GameBoard</div>
          <GamePieces gamePieces={game.players[0].playerPieces} playerId={game.players[0].playerId}></GamePieces>
        </div>
      }
    </div>
  )
};

const container = document.createElement('div');
document.body.appendChild(container);

ReactDOM.render(
  React.createElement(blockGame, { server: new server() }),
  container
);
