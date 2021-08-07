import React = require("react");
import Action from "../../shared/types/Actions";
import GameBoard from "./gameBoard";
import GamePieces from "./gamePieces";
import ActivePieceContainer from "./activePiece";
import GamePiece, { ActiveGamePiece, GamePiecesData } from "../../shared/types/GamePiece";
import * as pieceUtils from "../../shared/pieceUtils";
import GameState from "../../shared/types/GameState";
import StagedPiece from "../../frontend/StagedPiece";

interface GameContainerProps {
    gameState: GameState;
    action: (action: Action) => any;
}

function GameContainer({ gameState, action }: GameContainerProps) {
    const [activePiece, setActivePiece] = React.useState<ActiveGamePiece>();
    const [stagedPiece, setStagedPiece] = React.useState<StagedPiece>();

    const rotate = (piece: ActiveGamePiece, reverse: boolean = false) => {
        const result = {
            ...piece,
            pieceData: reverse
                ? pieceUtils.rotateReverse(piece.pieceData)
                : pieceUtils.rotate(piece.pieceData),
            rotate: reverse ? (piece.rotate + 3) % 4 : (piece.rotate + 1) % 4
        } as ActiveGamePiece;
        setActivePiece(result);
    };

    const flip = (piece: ActiveGamePiece) => {
        const result = {
            ...piece,
            pieceData: pieceUtils.flip(piece.pieceData),
            rotate: piece.rotate > 0 ? 4 - piece.rotate : 0,
            flip: !piece.flip
        } as ActiveGamePiece;
        setActivePiece(result);
    };

    const pass = () => {
        action({ playerId: gameState.currentPlayer, kind: "Pass" });
        setStagedPiece(undefined);
        setActivePiece(undefined);
    };

    const pickUpStagedPiece = (mouseOffsetX: number = 0, mouseOffsetY: number = 0) => {
        setActivePiece(stagedPiece && { ...stagedPiece, mouseOffsetX, mouseOffsetY });
        setStagedPiece(undefined);
    };

    const stagePiece = (yCoord: number, xCoord: number) => {
        if (!activePiece) return;

        const xCoordWithOffset = xCoord - activePiece?.mouseOffsetX;
        const yCoordWithOffset = yCoord - activePiece?.mouseOffsetY;

        const pieceFitsOnBoard = (piece: GamePiece) => {
            const pieceX = piece.pieceData[0].length;
            const pieceY = piece.pieceData.length;

            return xCoordWithOffset >= 0 &&
                yCoordWithOffset >= 0 &&
                xCoordWithOffset + pieceX <= 20 &&
                yCoordWithOffset + pieceY <= 20;
        };

        if (pieceFitsOnBoard(activePiece)) {
            const stagedPiece = {
                ...activePiece,
                target: { x: xCoordWithOffset, y: yCoordWithOffset }
            };

            setStagedPiece(stagedPiece);
            setActivePiece(undefined);
        }
    };

    const handlePlayerPieceClick = (pieceId: number, mouseOffsetX: number, mouseOffsetY: number) => {
        setActivePiece({
            playerId: gameState.currentPlayer,
            pieceData: GamePiecesData[pieceId],
            id: pieceId,
            rotate: 0 as 0 | 1 | 2 | 3,
            flip: false,
            mouseOffsetX,
            mouseOffsetY
        });
        setStagedPiece(undefined);
    };

    const confirmMove = () => {
        const actionResult = action({
            kind: "GamePlay",
            playerId: gameState.currentPlayer,
            piece: stagedPiece?.id ?? -1,
            location: stagedPiece?.target ?? { x: -1, y: -1 },
            rotate: stagedPiece?.rotate ?? 0,
            flip: stagedPiece?.flip ?? false
        });
        setActivePiece(undefined);
        if (!actionResult.errorMessage) setStagedPiece(undefined);
    };

    const cancelMove = () => {
        setStagedPiece(undefined);
    };

    return (
        <>
            <div
                className={`left-pane ${activePiece !== undefined ? "hide-cursor" : ""
                    }`}
            >
                <div className={"inner"}>
                    <div className={"flex-row space-between"}>
                        <h2>Player {gameState.currentPlayer}'s Turn</h2>
                        <div className={"action-buttons-container"}>
                            {stagedPiece === undefined ? (
                                <PassButton pass={pass} />
                            ) : null}
                            {stagedPiece === undefined ? null : (
                                <CancelButton cancelMove={cancelMove} />
                            )}
                            {stagedPiece === undefined ? null : (
                                <ConfirmButton confirmMove={confirmMove} />
                            )}
                        </div>
                    </div>
                    <GameBoard
                        boardState={gameState.boardState}
                        stagedPiece={stagedPiece}
                        stagePiece={stagePiece}
                        pickUpStagedPiece={pickUpStagedPiece}
                    />
                </div>
            </div>
            <div className={`right-pane`}>
                <div className={"inner"}>
                    <GamePieces
                        gamePieces={
                            gameState.players[gameState.currentPlayer - 1]
                                .playerPieces
                        }
                        playerId={gameState.currentPlayer}
                        onClickPiece={handlePlayerPieceClick}
                    />
                </div>
            </div>
            <ActivePieceContainer
                piece={activePiece}
                rotate={rotate}
                flip={flip}
            />
        </>
    );
}

const PassButton = ({ pass }: { pass: () => void }) => (
    <button className="btn-secondary" data-player-pass-button onClick={pass}>
        Pass
    </button>
);

const CancelButton = ({ cancelMove }: { cancelMove: () => void }) => (
    <button className="btn-secondary" data-cancel-action onClick={cancelMove}>
        Cancel Move
    </button>
);

const ConfirmButton = ({ confirmMove }: { confirmMove: () => void }) => (
    <button className="btn-primary" data-confirm-action onClick={confirmMove}>
        Confirm Move
    </button>
);

export default GameContainer;
