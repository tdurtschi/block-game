import { BoardState } from "../server/Game";
import PlayerId from "../server/PlayerId";
import { BoardLocation } from "./types/Actions";

function applyPieceToBoard(
    { x, y }: BoardLocation,
    pieceData: number[][],
    playerId: PlayerId,
    gameBoard: Readonly<BoardState>) {
    const newBoard: BoardState = gameBoard.map(row => row.map(col => col));

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

export {
    applyPieceToBoard,
    rotate,
    rotateReverse,
    flip,
    clone
};