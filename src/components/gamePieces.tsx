import React = require("react");
import GamePiece, { GamePiecesData } from "../types/GamePiece";
import PlayerId from "../server/PlayerId";

interface GamePiecesProps {
    gamePieces: GamePiece[];
    playerId: PlayerId;
    onClickPiece: (pieceId: number) => any;
}

function GamePieces(props: GamePiecesProps) {
    return (
        <div data-player-pieces
            className={`game-pieces player-${props.playerId}-color`}>
            {
                props.gamePieces.map((piece, idx) =>
                    <Piece key={idx} pieceId={piece.pieceId} onClick={props.onClickPiece} />)
            }
        </div>);
}

function Piece({ pieceId, onClick }: { pieceId: number, onClick: (pieceId: number) => any }) {
    const piece = GamePiecesData[pieceId];
    if (!piece) throw new Error(`Piece ID ${pieceId} invalid.`);

    return <div
        className={"game-piece"}
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

export default GamePieces;