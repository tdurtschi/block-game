import React = require("react");
import { BoardState } from "../server/Game";
import PlayerId from "../server/PlayerId";

function GameBoard({ boardState }: { boardState: Readonly<BoardState> }) {
    return (<div className="game-board" data-game-board>
        {
            boardState.map((row, rowIdx) => <BoardRow row={row} key={rowIdx} />)
        }
    </div >)
}

function BoardRow({ row }: { row: (PlayerId | undefined)[] }) {
    return <div
        className={`board-row`}
    >
        {row.map((col, colIdx) => <BoardCell playerId={col} key={colIdx} />)}
    </div>
}

function BoardCell({ playerId }: { playerId: PlayerId | undefined }) {
    return <div className={`board-cell ${getCellColorClass(playerId)}`}></div>
}

function getCellColorClass(playerId: PlayerId | undefined) {
    if (playerId) return `player-${playerId}-color`;
    else return ``;
}

export default GameBoard;