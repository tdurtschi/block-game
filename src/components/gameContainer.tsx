import React = require("react");
import Action, { BoardLocation } from "../types/Actions";
import { GameState } from "../server/Game";
import GameStatus from "../types/GameStatus";
import GameBoard from "./gameBoard";
import GamePieces from "./gamePieces";

interface GameContainerProps {
    gameState: GameState;
    action: (gameId: number, action: Action) => any;
}

function GameContainer({ gameState, action }: GameContainerProps) {
    const gameOver = gameState.status == GameStatus.OVER;

    const [activePiece, setActivePiece] = React.useState<number>();
    const [boardTarget, setBoardTarget] = React.useState<BoardLocation>();

    const handleGameBoardClick = (yCoord: number, xCoord: number) => {
        setBoardTarget({ x: xCoord, y: yCoord });
    }

    const handlePlayerPieceClick = (pieceId: number) => {
        setActivePiece(pieceId);
    }

    const confirmMove = () => {
        action(gameState.id, {
            kind: "GamePlay",
            playerId: gameState.currentPlayer,
            piece: activePiece ?? -1,
            location: boardTarget ?? { x: -1, y: -1 }
        });
    }

    return <div className="game-container">
        {!gameOver && <div>
            <h2>Player {gameState.currentPlayer}'s Turn</h2>
            <GamePieces
                gamePieces={gameState.players[gameState.currentPlayer - 1].playerPieces}
                playerId={gameState.currentPlayer}
                onClickPiece={handlePlayerPieceClick}
            />
            <button
                className="btn-secondary"
                data-player-pass-button
                onClick={() => {
                    action(gameState.id, { playerId: gameState.currentPlayer, kind: "Pass" });
                }}
            >
                Pass
            </button>
            <button
                className="btn-primary"
                data-confirm-action
                onClick={confirmMove}
            >
                Confirm Move
            </button>
        </div>}
        {gameOver &&
            <h2 data-game-over>
                Game Over
              </h2>
        }
        <GameBoard
            boardState={gameState.boardState}
            onClick={handleGameBoardClick}
        />
    </div>
}

export default GameContainer;