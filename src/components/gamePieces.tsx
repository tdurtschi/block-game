import React = require("react");
import GamePiece, { GamePiecesData } from "../shared/types/GamePiece";
import PlayerId from "../shared/types/PlayerId";
import Piece from "./gamePiece";

interface GamePiecesProps {
    gamePieces: GamePiece[];
    playerId: PlayerId;
    onClickPiece: (pieceId: number) => any;
}

function GamePieces(props: GamePiecesProps) {
    return (
        <>
            <h2>Player {props.playerId}'s Turn</h2>
            <div data-player-pieces
                className={`game-pieces`}>
                {
                    props.gamePieces.map((piece, idx) =>
                        <Piece
                            key={idx}
                            piece={piece}
                            playerId={props.playerId}
                            onClick={props.onClickPiece} />)
                }
            </div>
        </>);
}

export default GamePieces;