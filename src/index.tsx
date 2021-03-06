import { useState } from "react";
import React = require("react");
import ReactDOM = require("react-dom");
import GamePieces from "./gamePieces";
import server from "./server";
import Game from "./server/Game";

function blockGame({ server }: { server: server }) {
  const [game, setGame] = useState<Game | undefined>();
  const [gameState, setGameState] = useState<any>();

  const startGame = () => {
    setGame(server.newGame());
  }

  const { currentPlayer } = gameState ?? { currentPlayer: 1 };

  return (
    <div>
      <header>
        <h1>Block Game</h1>
      </header>
      <button
        className="btn-primary"
        disabled={!!(game && !game.isOver)}
        data-new-game onClick={startGame}>
        New Game
      </button>
      {
        game && <div className="game-container">
          {!game.isOver && <div>
            <h2>Player {currentPlayer}'s Turn</h2>
            <GamePieces gamePieces={game.players[0].playerPieces} playerId={game.getPlayer(currentPlayer).playerId}></GamePieces>
            <button
              className="btn-secondary"
              data-player-pass-button
              data-new-game onClick={() => {
                game.action({ playerId: currentPlayer, kind: "Pass" })
                setGameState(game.getState())
              }}>
              Pass
          </button>
          </div>}
          {game.isOver && <h2 data-game-over>
            Game Over
            </h2>}
          <div data-game-board>GameBoard</div>
        </div>
      }
    </div >
  )
};

const container = document.createElement('div');
document.body.appendChild(container);

ReactDOM.render(
  React.createElement(blockGame, { server: new server() }),
  container
);
