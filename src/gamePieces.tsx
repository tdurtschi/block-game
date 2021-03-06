import React = require("react");
import GamePiece from "./server/GamePiece";
import PlayerId from "./server/PlayerId";

interface GamePiecesProps {
    gamePieces: GamePiece[]
    playerId: PlayerId
}

export default function (props: GamePiecesProps) {
    return (<div data-player-pieces className={`game-pieces player-${props.playerId}-color`}>
        {
            props.gamePieces.map((piece, idx) =>
                <div className={"game-piece"} key={idx} data-game-piece>
                    <Piece pieceId={piece.pieceId} />
                </div>)
        }
    </div>);
}

const PieceRow = ({ row }: { row: number[] }) => <div className={"row"}>
    {
        row.map((col, idx2) => <div className={`${col === 1 ? "filled" : ''}`} key={idx2}></div>)
    }
</div>;

function Piece({ pieceId }: { pieceId: number }) {
    const piece = gamePiecesData[pieceId];
    if (!piece) throw new Error(`Piece ID ${pieceId} invalid.`);

    return (<>{
        piece.map((row, idx) => <PieceRow key={idx} row={row} />)
    }</>);
}


const gamePiecesData = [
    [		//0
        [0, 1],
        [0, 1],
        [1, 1],
        [1, 0]],

    [		//1
        [0, 1],
        [1, 1],
        [0, 1],
        [0, 1]],

    [		//2
        [1, 1, 0],
        [0, 1, 1],
        [0, 1, 0]],

    [		//3
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 1]],

    [		//4
        [1, 0, 0],
        [1, 0, 0],
        [1, 1, 1]],

    [		//5
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 1]],

    [		//6
        [1, 0, 1],
        [1, 1, 1]],

    [		//7
        [0, 1, 1],
        [0, 1, 0],
        [1, 1, 0]],

    [		//8
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 0]],

    [		//9
        [0, 1, 0],
        [1, 1, 1]],

    [		//10
        [0, 1],
        [1, 1],
        [1, 0]],

    [		//11
        [1, 0],
        [1, 1],
        [1, 1]],

    [		//12
        [1, 1],
        [1, 1]],

    [		//13
        [1, 0],
        [1, 0],
        [1, 0],
        [1, 1]],

    [		//14
        [1, 0],
        [1, 0],
        [1, 1]],

    [		//15
        [1, 0],
        [1, 1]],

    [		//16
        [1],
        [1],
        [1],
        [1],
        [1]],

    [		//17
        [1],
        [1],
        [1],
        [1]],

    [		//18
        [1],
        [1],
        [1]],

    [		//19
        [1],
        [1]],

    [		//20
        [1]]
];