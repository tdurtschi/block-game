import React = require("react");
import PlayerId from "../../shared/types/PlayerId";
import GamePieceModel from "../../shared/types/GamePiece";

interface GamePieceProps {
    piece: GamePieceModel;
    playerId: PlayerId;
    onClick: (pieceId: number) => any;
}

function GamePiece({ piece, onClick, playerId }: GamePieceProps) {
    return (
        <div
            className={`game-piece player-${playerId}-color`}
            data-game-piece
            onClick={() => onClick(piece.id)}
        >
            {piece.pieceData.map((row, idx) => (
                <PieceRow key={idx} row={row} />
            ))}
        </div>
    );
}

function PieceRow({ row }: { row: number[] }) {
    return (
        <div className={"row"}>
            {row.map((col, idx2) => (
                <div
                    className={`${col === 1 ? "filled" : ""}`}
                    key={idx2}
                ></div>
            ))}
        </div>
    );
}

export default GamePiece;
