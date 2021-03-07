import React = require("react");
import GamePiece, { GamePiecesData } from "../types/GamePiece";
import PlayerId from "../server/PlayerId";

interface GamePiecesProps {
    gamePieces: GamePiece[]
    playerId: PlayerId
}

function GamePieces(props: GamePiecesProps) {
    return (<div data-player-pieces className={`game-pieces player-${props.playerId}-color`}>
        {
            props.gamePieces.map((piece, idx) =>
                <div className={"game-piece"} key={idx} data-game-piece>
                    <Piece pieceId={piece.pieceId} />
                </div>)
        }
    </div>);
}

function Piece({ pieceId }: { pieceId: number }) {
    const piece = GamePiecesData[pieceId];
    if (!piece) throw new Error(`Piece ID ${pieceId} invalid.`);

    return <>{
        piece.map((row, idx) => <PieceRow key={idx} row={row} />)
    }</>;
}

function PieceRow({ row }: { row: number[] }) {
    return <div className={"row"}>
        {
            row.map((col, idx2) => <div className={`${col === 1 ? "filled" : ''}`} key={idx2}></div>)
        }
    </div>;
}

export default GamePieces;