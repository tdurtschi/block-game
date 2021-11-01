import React = require("react");
import Action from "../../shared/types/Actions";
import GameBoard from "./gameBoard";
import GamePieces from "./gamePieces";
import ActivePieceContainer from "./activePiece";
import GamePiece, { ActiveGamePiece, GamePiecesData } from "../../shared/types/GamePiece";
import * as pieceUtils from "../../shared/pieceUtils";
import GameState from "../../shared/types/GameState";
import StagedPiece from "./StagedPiece";
import { GameInfo } from "./gameInfo";
import { ConfirmButton } from "../shared/confirmButton";

interface GameContainerProps {
    gameState: GameState;
    action: (action: Action) => { errorMessage?: string };
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
            playerId: gameState.currentPlayerId,
            pieceData: GamePiecesData[pieceId],
            id: pieceId,
            rotate: 0 as 0 | 1 | 2 | 3,
            flip: false,
            mouseOffsetX,
            mouseOffsetY
        });
        setStagedPiece(undefined);
    };

    const ActionButtons = ({ showMoveConfirmationPrompt }: { showMoveConfirmationPrompt: boolean }) => {
        const [showPassConfirmationPrompt, setShowPassConfirmationPrompt] = React.useState<boolean>(false);

        const cancelPass = () => {
            setShowPassConfirmationPrompt(false);
        };

        const pass = () => {
            setShowPassConfirmationPrompt(true);
        };

        const confirmPass = () => {
            action({ playerId: gameState.currentPlayerId, kind: "Pass" });
            setStagedPiece(undefined);
            setActivePiece(undefined);
            setShowPassConfirmationPrompt(false);
        }

        const cancelMove = () => {
            setStagedPiece(undefined);
        };

        const confirmMove = () => {
            const actionResult = action({
                kind: "GamePlay",
                playerId: gameState.currentPlayerId,
                piece: stagedPiece?.id ?? -1,
                location: stagedPiece?.target ?? { x: -1, y: -1 },
                rotate: stagedPiece?.rotate ?? 0,
                flip: stagedPiece?.flip ?? false
            });
            setActivePiece(undefined);
            if (!actionResult.errorMessage) setStagedPiece(undefined);
        };

        if (showPassConfirmationPrompt) {
            return (<>
                <CancelButton action={cancelPass} />
                <ConfirmButton label={"Confirm Pass"} action={confirmPass} />
            </>)
        } else if (showMoveConfirmationPrompt) {
            return (<>
                <CancelButton action={cancelMove} />
                <ConfirmButton label={"Confirm Move"} action={confirmMove} />
            </>);
        } else {
            return (<>
                <PassButton pass={pass} />
            </>);
        }
    }

    function currentPlayersName() {
        const player = gameState.players.find(p => p.playerId === gameState.currentPlayerId);
        if (!player) throw new Error("Couldn't find player with id:" + gameState.currentPlayerId);
        return player?.name;
    }

    return (
        <>
            <div
                className={`left-pane ${activePiece !== undefined ? "hide-cursor" : ""}`}
            >
                <div className={"inner"}>
                    <div className={"flex-row space-between"}>
                        <h2>{currentPlayersName()}'s Turn</h2>
                        <div className={"action-buttons-container"}>
                            <ActionButtons showMoveConfirmationPrompt={stagedPiece !== undefined} />
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
                    <GameInfo gameState={gameState} />
                    <GamePieces
                        gamePieces={
                            gameState.players[gameState.currentPlayerId - 1]
                                .playerPieces
                        }
                        playerId={gameState.currentPlayerId}
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

const CancelButton = ({ action }: { action: () => void }) => (
    <button className="btn-secondary" data-cancel-action onClick={action}>
        Cancel
    </button>
);

export default GameContainer;
