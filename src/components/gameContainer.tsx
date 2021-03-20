import React = require("react");
import Action, { BoardLocation } from "../shared/types/Actions";
import GameStatus from "../shared/types/GameStatus";
import GameBoard from "./gameBoard";
import GamePieces from "./gamePieces";
import ActivePieceContainer from "./activePiece";
import { applyPieceToBoard } from "../shared/pieceUtils";
import GamePiece, { GamePiecesData } from "../shared/types/GamePiece";
import * as pieceUtils from "../shared/pieceUtils"
import GameState from "../shared/types/GameState";

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
                : pieceUtils.rotate(piece.pieceData),
            rotate: reverse ? piece.rotate + 3 % 4
                : piece.rotate + 1,
            flip: piece.flip
        } as GamePiece;
        setActivePiece(result);
    }

    const flip = (piece: GamePiece) => {
        const result = {
            id: piece?.id,
            pieceData: pieceUtils.flip(piece.pieceData),
            rotate: piece.rotate > 0 ? 4 - piece.rotate : 0,
            flip: !piece.flip
        } as GamePiece;
        setActivePiece(result);
    }

    const pass = () => {
        action(gameState.id, { playerId: gameState.currentPlayer, kind: "Pass" });
        setStagedPiece(undefined);
        setActivePiece(undefined);
    }

    const handleGameBoardClick = (yCoord: number, xCoord: number) => {
        if (activePiece !== undefined) {
            const stagedPiece = {
                pieceData: activePiece.pieceData,
                id: activePiece.id,
                rotate: activePiece.rotate,
                flip: activePiece.flip
            };

            setBoardTarget({ x: xCoord, y: yCoord });
            setStagedPiece(stagedPiece);
            setActivePiece(undefined);
        }
    }

    const handlePlayerPieceClick = (pieceId: number) => {
        setActivePiece({
            pieceData: GamePiecesData[pieceId],
            id: pieceId,
            rotate: 0 as 0 | 1 | 2 | 3,
            flip: false
        });
        setStagedPiece(undefined);
        setBoardTarget(undefined);
    }

    const confirmMove = () => {
        action(gameState.id, {
            kind: "GamePlay",
            playerId: gameState.currentPlayer,
            piece: stagedPiece?.id ?? -1,
            location: boardTarget ?? { x: -1, y: -1 },
            rotate: stagedPiece?.rotate ?? 0,
            flip: stagedPiece?.flip ?? false
        });
        setBoardTarget(undefined);
        setActivePiece(undefined);
    }

    if (gameOver) {
        return <h2 data-game-over>
            Game Over
        </h2>
    } else {
        return (
            <div
                className={`game-container ${activePiece !== undefined ? 'hide-cursor' : ''}`}
                onContextMenu={(e) => { e.preventDefault(); return false }}
            >
                <div className={`left-pane`}>
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
                    <div className={"action-buttons-container"}>
                        <button
                            className="btn-secondary"
                            data-player-pass-button
                            onClick={pass}
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
                    </div>
                </div>
                <div className={`right-pane`}>
                    <GamePieces
                        gamePieces={gameState.players[gameState.currentPlayer - 1].playerPieces}
                        playerId={gameState.currentPlayer}
                        onClickPiece={handlePlayerPieceClick}
                    />
                </div>
                <ActivePieceContainer
                    piece={activePiece}
                    playerId={gameState.currentPlayer}
                    rotate={rotate}
                    flip={flip}
                />
            </div>
        )
    }
}

export default GameContainer;