import React = require("react");
import Action, { BoardLocation } from "../shared/types/Actions";
import { GameState } from "../server/Game";
import GameStatus from "../shared/types/GameStatus";
import GameBoard from "./gameBoard";
import GamePieces from "./gamePieces";
import ActivePiece from "./activePiece";
import applyPieceToBoard from "../shared/applyPiece";

interface GameContainerProps {
    gameState: GameState;
    action: (gameId: number, action: Action) => any;
}

function GameContainer({ gameState, action }: GameContainerProps) {
    const gameOver = gameState.status == GameStatus.OVER;

    const [activePiece, setActivePiece] = React.useState<number>();
    const [stagedPiece, setStagedPiece] = React.useState<number>();
    const [boardTarget, setBoardTarget] = React.useState<BoardLocation>();

    const handleGameBoardClick = (yCoord: number, xCoord: number) => {
        setBoardTarget({ x: xCoord, y: yCoord });
        setStagedPiece(activePiece);
        setActivePiece(undefined);
    }

    const handlePlayerPieceClick = (pieceId: number) => {
        setActivePiece(pieceId);
        setStagedPiece(undefined);
        setBoardTarget(undefined);
    }

    const confirmMove = () => {
        action(gameState.id, {
            kind: "GamePlay",
            playerId: gameState.currentPlayer,
            piece: stagedPiece ?? -1,
            location: boardTarget ?? { x: -1, y: -1 }
        });
        setBoardTarget(undefined);
        setActivePiece(undefined);
    }

    return <div className={`game-container ${activePiece !== undefined ? 'hide-cursor' : ''}`}>
        {!gameOver &&
            <div>
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
                {activePiece != undefined &&
                    <ActivePiece
                        pieceId={activePiece}
                        playerId={gameState.currentPlayer}
                    />
                }
            </div>
        }
        {gameOver &&
            <h2 data-game-over>
                Game Over
              </h2>
        }
        {stagedPiece !== undefined && boardTarget ?
            <GameBoard
                boardState={applyPieceToBoard(boardTarget, stagedPiece, gameState.currentPlayer, gameState.boardState)}
                onClick={handleGameBoardClick}
            />
            : <GameBoard
                boardState={gameState.boardState}
                onClick={handleGameBoardClick}
            />
        }
    </div>
}

export default GameContainer;