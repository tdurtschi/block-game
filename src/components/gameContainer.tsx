import React = require("react");
import Action, { BoardLocation } from "../shared/types/Actions";
import { GameState } from "../server/Game";
import GameStatus from "../shared/types/GameStatus";
import GameBoard from "./gameBoard";
import GamePieces from "./gamePieces";
import ActivePiece from "./activePiece";
import { applyPieceToBoard } from "../shared/pieceUtils";
import GamePiece, { GamePiecesData } from "../shared/types/GamePiece";
import * as pieceUtils from "../shared/pieceUtils"

interface GameContainerProps {
    gameState: GameState;
    action: (gameId: number, action: Action) => any;
}

function GameContainer({ gameState, action }: GameContainerProps) {
    const gameOver = gameState.status == GameStatus.OVER;

    const [activePiece, setActivePiece] = React.useState<GamePiece>();
    const [stagedPiece, setStagedPiece] = React.useState<GamePiece>();
    const [boardTarget, setBoardTarget] = React.useState<BoardLocation>();

    const rotate = (piece: GamePiece, reverse: boolean = false) => {
        const result = {
            id: piece?.id,
            pieceData: reverse ? pieceUtils.rotateReverse(piece.pieceData)
                : pieceUtils.rotate(piece.pieceData)
        };
        setActivePiece(result);
    }

    const handleGameBoardClick = (yCoord: number, xCoord: number) => {
        setBoardTarget({ x: xCoord, y: yCoord });

        const stagedPiece = activePiece !== undefined ? {
            pieceData: activePiece.pieceData,
            id: activePiece.id
        }
            : undefined;

        setStagedPiece(stagedPiece);
        setActivePiece(undefined);
    }

    const handlePlayerPieceClick = (pieceId: number) => {
        setActivePiece({
            pieceData: GamePiecesData[pieceId],
            id: pieceId
        });
        setStagedPiece(undefined);
        setBoardTarget(undefined);
    }

    const confirmMove = () => {
        action(gameState.id, {
            kind: "GamePlay",
            playerId: gameState.currentPlayer,
            piece: stagedPiece?.id ?? -1,
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
                        piece={activePiece}
                        playerId={gameState.currentPlayer}
                        rotate={rotate}
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
                boardState={applyPieceToBoard(boardTarget, stagedPiece.pieceData, gameState.currentPlayer, gameState.boardState)}
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