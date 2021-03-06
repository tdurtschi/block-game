import React = require("react");
import BoardState from "../../shared/types/BoardState";
import PlayerId from "../../shared/types/PlayerId";
import { applyPieceToBoard } from "../../shared/pieceUtils";
import StagedPiece from "./StagedPiece";

interface GameBoardProps {
    boardState: Readonly<BoardState>;
    stagePiece?: (yCoord: number, xCoord: number) => any;
    pickUpStagedPiece?: (mouseOffsetX?: number, mouseOffsetY?: number) => any;
    stagedPiece?: StagedPiece;
}

function GameBoard({
    boardState,
    stagePiece,
    pickUpStagedPiece,
    stagedPiece
}: GameBoardProps) {
    const onClick = (yCoord: number, xCoord: number) => {
        if (stagedPiece && pickUpStagedPiece) {
            pickUpStagedPiece();
        } else if (stagePiece) {
            stagePiece(yCoord, xCoord);
        }
    };

    const boardStateToRender = stagedPiece
        ? applyPieceToBoard(
            stagedPiece.target,
            stagedPiece.pieceData,
            stagedPiece.playerId,
            boardState
        )
        : boardState;

    return (
        <div className="game-board">
            <div className={"game-underlay"}>
                {gameBoardUnderlayData.map((row, rowIdx) => (
                    <BoardRow
                        row={row}
                        key={rowIdx}
                        yCoord={rowIdx}
                        onClick={onClick}
                    />
                ))}
            </div>
            <div style={{ position: "relative" }} data-game-board>
                {boardStateToRender.map((row, rowIdx) => (
                    <BoardRow
                        row={row}
                        key={rowIdx}
                        yCoord={rowIdx}
                        onClick={onClick}
                    />
                ))}
            </div>
        </div>
    );
}

interface BoardRowProps {
    row: (PlayerId | undefined)[];
    yCoord: number;
    onClick: (yCoord: number, xCoord: number) => any;
}

function BoardRow({ row, yCoord, onClick }: BoardRowProps) {
    return (
        <div className={`board-row`}>
            {row.map((col, xCoord) => (
                <BoardCell
                    playerId={col}
                    key={xCoord}
                    yCoord={yCoord}
                    xCoord={xCoord}
                    onClick={onClick}
                />
            ))}
        </div>
    );
}

interface BoardCellProps {
    playerId: PlayerId | undefined;
    xCoord: number;
    yCoord: number;
    onClick: (yCoord: number, xCoord: number) => any;
}

function BoardCell({ playerId, xCoord, yCoord, onClick }: BoardCellProps) {
    return (
        <div
            className={`board-cell ${getCellColorClass(playerId)}`}
            data-coord-y={yCoord}
            data-coord-x={xCoord}
            onClick={() => onClick(yCoord, xCoord)}
        />
    );
}

function getCellColorClass(playerId: PlayerId | undefined) {
    if (playerId) return `player-${playerId}-color filled`;
    else return ``;
}

const createEmptyBoard = () => {
    const rows = new Array(20).fill(new Array(20).fill(undefined));
    return rows;
};

const gameBoardUnderlayData = createEmptyBoard();

export default GameBoard;
