import React = require("react");
import { BoardState } from "../server/Game";
import PlayerId from "../server/PlayerId";

interface GameBoardProps {
    boardState: Readonly<BoardState>;
    onClick: (yCoord: number, xCoord: number) => any;
}

function GameBoard({ boardState, onClick }: GameBoardProps) {
    return (<div className="game-board" data-game-board>
        {
            boardState.map((row, rowIdx) =>
                <BoardRow
                    row={row}
                    key={rowIdx}
                    yCoord={rowIdx}
                    onClick={onClick} />)
        }
    </div >)
}

interface BoardRowProps {
    row: (PlayerId | undefined)[];
    yCoord: number;
    onClick: (yCoord: number, xCoord: number) => any;
}

function BoardRow({ row, yCoord, onClick }: BoardRowProps) {
    return <div
        className={`board-row`}
    >
        {row.map((col, xCoord) => <BoardCell
            playerId={col}
            key={xCoord}
            yCoord={yCoord}
            xCoord={xCoord}
            onClick={onClick} />)}
    </div>
}

interface BoardCellProps {
    playerId: PlayerId | undefined;
    xCoord: number;
    yCoord: number;
    onClick: (yCoord: number, xCoord: number) => any;
}

function BoardCell({ playerId, xCoord, yCoord, onClick }: BoardCellProps) {
    return <div
        className={`board-cell ${getCellColorClass(playerId)}`}
        data-coord-y={yCoord}
        data-coord-x={xCoord}
        onClick={() => onClick(yCoord, xCoord)}
    />
}

function getCellColorClass(playerId: PlayerId | undefined) {
    if (playerId) return `player-${playerId}-color filled`;
    else return ``;
}

export default GameBoard;