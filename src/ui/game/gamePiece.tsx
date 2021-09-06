import React = require("react");
import PlayerId from "../../shared/types/PlayerId";
import GamePieceModel from "../../shared/types/GamePiece";

interface GamePieceProps {
    piece: GamePieceModel;
    playerId: PlayerId;
    onClick: (pieceId: number, mouseOffsetX: number, mouseOffsetY: number) => any;
}

function GamePiece({ piece, onClick, playerId }: GamePieceProps) {
    const onClickGamePiece = (pieceId: number, mouseOffsetX: number, mouseOffsetY: number) => {
        onClick(pieceId, mouseOffsetX, mouseOffsetY);
    }

    const onClickPieceRow = (mouseOffsetX: number, mouseOffsetY: number) => onClickGamePiece(piece.id, mouseOffsetX, mouseOffsetY);

    return (
        <div
            className={`game-piece player-${playerId}-color`}
            data-game-piece
        >
            {piece.pieceData.map((row, idx) => (
                <PieceRow key={idx} row={row} rowIndex={idx} onClickPieceRow={onClickPieceRow} />
            ))}
        </div>
    );
}

interface PieceRowProps {
    row: number[];
    rowIndex: number;
    onClickPieceRow: (mouseOffsetX: number, mouseOffsetY: number) => any;
};

function PieceRow({ row, rowIndex, onClickPieceRow }: PieceRowProps) {
    return (
        <div className={"row"}>
            {row.map((col, idx2) => (
                <div
                    className={`${col === 1 ? "filled" : ""}`}
                    key={idx2}
                    onClick={(e) => {
                        onClickPieceRow(idx2, rowIndex)
                    }}
                ></div>
            ))}
        </div>
    );
}

export default GamePiece;
