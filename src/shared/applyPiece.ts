import { BoardState } from "../server/Game";
import PlayerId from "../server/PlayerId";
import { BoardLocation } from "./types/Actions";
import { GamePiecesData } from "./types/GamePiece";

function applyPieceToBoard(
    { x, y }: BoardLocation,
    pieceId: number,
    playerId: PlayerId,
    gameBoard: Readonly<BoardState>) {
    const newBoard: BoardState = gameBoard.map(row => row.map(col => col));

    var pieceData = GamePiecesData[pieceId];
    for (var i = 0; i < pieceData.length; i++) {
        for (var j = 0; j < pieceData[i].length; j++) {
            if (pieceData[i][j] == 1) {
                newBoard[y + i][x + j] = playerId;
            }
        }
    }

    return newBoard;
}

export default applyPieceToBoard;