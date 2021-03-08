import React = require("react");
import PlayerId from "../server/PlayerId";
import { GamePiecesData } from "../shared/types/GamePiece";

interface GamePieceProps {
    pieceId: number,
    playerId: PlayerId,
    onClick: (pieceId: number) => any
}

function GamePiece({ pieceId, onClick, playerId }: GamePieceProps) {
    const piece = GamePiecesData[pieceId];
    if (!piece) throw new Error(`Piece ID ${pieceId} invalid.`);

    return <div
        className={`game-piece player-${playerId}-color`}
        data-game-piece
        onClick={() => onClick(pieceId)}
    >
        {
            piece.map((row, idx) => <PieceRow key={idx} row={row} />)
        }
    </div>;
}

function PieceRow({ row }: { row: number[] }) {
    return <div className={"row"}>
        {
            row.map((col, idx2) => <div className={`${col === 1 ? "filled" : ''}`} key={idx2}></div>)
        }
    </div>;
}

export default GamePiece;