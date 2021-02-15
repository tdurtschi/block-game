import { useState } from "react";
import React = require("react");
import ReactDOM = require("react-dom");
import server from "./server";
import Game from "./server/Game";

function blockGame({ server }: { server: server }) {
  const [game, setGame] = useState<Game | undefined>();

  const startGame = () => {
    setGame(server.newGame());
  }

  return (
    <div>
      <div>Block Game</div>
      {game ? <>
        <div data-game-board>GameBoard</div>
        <div data-player-pieces>PlayerPieces</div>
      </> :
        <button data-new-game onClick={startGame}>New Game</button>}
    </div>
  )
};

const container = document.createElement('div');
document.body.appendChild(container);

ReactDOM.render(
  React.createElement(blockGame, { server: new server() }),
  container
);
