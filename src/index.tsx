import { useState } from "react";
import React = require("react");
import ReactDOM = require("react-dom");
import GameContainer from "./components/gameContainer";
import server from "./server";
import { GameState } from "./server/Game";
import GameStatus from "./types/GameStatus";

function BlockGame({ server }: { server: server }) {
  const [gameState, setGameState] = useState<GameState>();

  const startGame = () => {
    const initialGameState = server.newGame();
    setGameState(initialGameState);

    server.subscribe(setGameState);
  }

  return (
    <>
      <header>
        <h1>Block Game</h1>
        <button
          className="btn-primary"
          disabled={gameState && gameState.status !== GameStatus.OVER}
          data-new-game
          onClick={startGame}
        >
          New Game
      </button>
      </header>
      {
        gameState && <GameContainer
          gameState={gameState}
          action={(id, action) => server.action(id, action)}
        />
      }
    </>
  )
};

const container = document.createElement('div');
container.className = "app-container";
document.body.appendChild(container);

ReactDOM.render(
  React.createElement(BlockGame, { server: new server() }),
  container
);
