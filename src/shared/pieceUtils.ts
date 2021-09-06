import PlayerId from "./types/PlayerId";
import { BoardLocation } from "./types/Actions";
import BoardState from "./types/BoardState";

function applyPieceToBoard(
    { x, y }: BoardLocation,
    pieceData: number[][],
    playerId: PlayerId,
    gameBoard: Readonly<BoardState>
) {
    const newBoard: BoardState = gameBoard.map((row) => row.map((col) => col));

    for (var i = 0; i < pieceData.length; i++) {
        for (var j = 0; j < pieceData[i].length; j++) {
            if (pieceData[i][j] == 1) {
                newBoard[y + i][x + j] = playerId;
            }
        }
    }

    return newBoard;
}

function rotate(pieceData: number[][]): number[][] {
    var newPiece: number[][] = [];
    for (var i = 0; i < pieceData[0].length; i++) {
        newPiece[i] = [];
        for (var j = 0; j < pieceData.length; j++) {
            newPiece[i][j] = pieceData[j][pieceData[0].length - 1 - i];
        }
    }
    return newPiece;
}

function rotateReverse(pieceData: number[][]): number[][] {
    return rotate(rotate(rotate(pieceData)));
}

function flip(pieceData: number[][]): number[][] {
    var newPiece: number[][] = [];
    for (var i = 0; i < pieceData.length; i++) {
        newPiece[i] = [];
        for (var j = 0; j < pieceData[0].length; j++) {
            newPiece[i][j] = pieceData[i][pieceData[0].length - 1 - j];
        }
    }

    return newPiece;
}

function clone(pieceData: number[][]): number[][] {
    var newPiece: number[][] = [];
    for (var i = 0; i < pieceData.length; i++) {
        newPiece[i] = [];
        for (var j = 0; j < pieceData[0].length; j++) {
            newPiece[i][j] = pieceData[i][j];
        }
    }

    return newPiece;
}

const applyFlip = flip;
const applyRotate = rotate;
function applyPieceModifications(
    pieceData: number[][],
    rotation: 0 | 1 | 2 | 3,
    flip: boolean = false
) {
    let result = clone(pieceData);

    if (flip) result = applyFlip(result);

    if (rotation == 0) {
        return result;
    } else if (rotation == 1) {
        return applyRotate(result);
    } else if (rotation == 2) {
        return applyRotate(applyRotate(result));
    } else {
        return applyRotate(applyRotate(applyRotate(result)));
    }
}

export { applyPieceToBoard, rotate, rotateReverse, flip, clone, applyPieceModifications };
