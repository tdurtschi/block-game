import React = require("react");
import Action from "../shared/types/Actions";
import GameBoard from "./gameBoard";
import GamePieces from "./gamePieces";
import ActivePieceContainer from "./activePiece";
import GamePiece, { GamePiecesData } from "../shared/types/GamePiece";
import * as pieceUtils from "../shared/pieceUtils";
import GameState from "../shared/types/GameState";
import StagedPiece from "../frontend/StagedPiece";

interface GameContainerProps {
    gameState: GameState;
    action: (action: Action) => any;
}

function GameContainer({ gameState, action }: GameContainerProps) {
    const [activePiece, setActivePiece] = React.useState<GamePiece>();
    const [stagedPiece, setStagedPiece] = React.useState<StagedPiece>();

    const rotate = (piece: GamePiece, reverse: boolean = false) => {
        const result = {
            ...piece,
            pieceData: reverse
                ? pieceUtils.rotateReverse(piece.pieceData)
                : pieceUtils.rotate(piece.pieceData),
            rotate: reverse ? (piece.rotate + 3) % 4 : (piece.rotate + 1) % 4
        } as GamePiece;
        setActivePiece(result);
    };

    const flip = (piece: GamePiece) => {
        const result = {
            ...piece,
            pieceData: pieceUtils.flip(piece.pieceData),
            rotate: piece.rotate > 0 ? 4 - piece.rotate : 0,
            flip: !piece.flip
        } as GamePiece;
        setActivePiece(result);
    };

    const pass = () => {
        action({ playerId: gameState.currentPlayer, kind: "Pass" });
        setStagedPiece(undefined);
        setActivePiece(undefined);
    };
    const pickUpStagedPiece = (yCoord: number, xCoord: number) => {
        setActivePiece(stagedPiece);
        setStagedPiece(undefined);
    };

    const stagePiece = (yCoord: number, xCoord: number) => {
        const pieceFitsOnBoard = (piece: GamePiece) => {
            const pieceX = piece.pieceData[0].length;
            const pieceY = piece.pieceData.length;

            return xCoord + pieceX <= 20 && yCoord + pieceY <= 20;
        };

        if (activePiece && pieceFitsOnBoard(activePiece)) {
            const stagedPiece = {
                ...activePiece,
                target: { x: xCoord, y: yCoord }
            };

            setStagedPiece(stagedPiece);
            setActivePiece(undefined);
        }
    };

    const handlePlayerPieceClick = (pieceId: number) => {
        setActivePiece({
            playerId: gameState.currentPlayer,
            pieceData: GamePiecesData[pieceId],
            id: pieceId,
            rotate: 0 as 0 | 1 | 2 | 3,
            flip: false
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
                className={`left-pane ${
                    activePiece !== undefined ? "hide-cursor" : ""
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
