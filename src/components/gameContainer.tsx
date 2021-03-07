import React = require("react");
import Action from "../types/Actions";
import { GameState } from "../server/Game";
import GameStatus from "../types/GameStatus";
import GameBoard from "./gameBoard";
import GamePieces from "./gamePieces";


interface GameContainerProps {
    gameState: GameState;
    action: (gameId: number, action: Action) => any;
}

function GameContainer({ gameState, action }: GameContainerProps) {
    return <div className="game-container">
        {gameState.status != GameStatus.OVER && <div>
            <h2>Player {gameState.currentPlayer}'s Turn</h2>
            <GamePieces gamePieces={gameState.players[gameState.currentPlayer - 1].playerPieces} playerId={gameState.currentPlayer}></GamePieces>
            <button
                className="btn-secondary"
                data-player-pass-button
                onClick={() => {
                    action(gameState.id, { playerId: gameState.currentPlayer, kind: "Pass" });
                }}
            >
                Pass
            </button>
        </div>}
        {gameState.status == GameStatus.OVER &&
            <h2 data-game-over>
                Game Over
              </h2>
        }
        <GameBoard boardState={gameState.boardState} />
    </div>
}

export default GameContainer;