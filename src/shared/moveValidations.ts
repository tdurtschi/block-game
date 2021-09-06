import InvalidActionError from "../server/errors/InvalidActionError";
import { GAMEBOARD_SIZE } from "./constants";
import { applyPieceModifications } from "./pieceUtils";
import { BoardLocation, GamePlayAction } from "./types/Actions";
import BoardState from "./types/BoardState";
import GamePiece, { GamePiecesData } from "./types/GamePiece";
import PlayerId from "./types/PlayerId";

const TOTAL_NUMBER_OF_PIECES = GamePiecesData.length;

export const MoveValidations = {
    cellTouchesPlayedPieceDiagonally: function (
        boardState: readonly (PlayerId | undefined)[][],
        location: BoardLocation,
        playerId: PlayerId
    ) {
        return (
            (location.y + 1 < boardState.length &&
                location.x + 1 < boardState[0].length &&
                boardState[location.y + 1][location.x + 1] == playerId) ||
            (location.y + 1 < boardState.length &&
                location.x > 0 &&
                boardState[location.y + 1][location.x - 1] == playerId) ||
            (location.y > 0 &&
                location.x + 1 < boardState[0].length &&
                boardState[location.y - 1][location.x + 1] == playerId) ||
            (location.y > 0 &&
                location.x > 0 &&
                boardState[location.y - 1][location.x - 1] == playerId)
        );
    },

    cellDoesntTouchPlayedPieceAdjacently: function (
        boardState: readonly (PlayerId | undefined)[][],
        location: BoardLocation,
        playerId: PlayerId
    ) {
        if (
            location.x > 0 &&
            boardState[location.y][location.x - 1] === playerId
        ) {
            return false;
        }
        if (
            location.y > 0 &&
            boardState[location.y - 1][location.x] === playerId
        ) {
            return false;
        }
        if (
            location.x < boardState[0].length - 1 &&
            boardState[location.y][location.x + 1] === playerId
        ) {
            return false;
        }
        if (
            location.y < boardState.length - 1 &&
            boardState[location.y + 1][location.x] === playerId
        ) {
            return false;
        }

        return true;
    },

    isFirstTurn: function (playerPieces: GamePiece[]) {
        if (playerPieces.length === TOTAL_NUMBER_OF_PIECES) {
            return true;
        } else {
            return false;
        }
    },

    validate_pieceDoesntOverlapExistingPiece: function (
        boardState: Readonly<BoardState>,
        { location }: GamePlayAction,
        pieceData: number[][]
    ) {
        var pieceY = pieceData.length;
        var pieceX = pieceData[0].length;
        for (var i = 0; i < pieceY; i++) {
            for (var j = 0; j < pieceX; j++) {
                if (
                    pieceData[i][j] !== 0 &&
                    boardState[location.y + i][location.x + j] !== undefined
                ) {
                    throw new InvalidActionError(
                        "Invalid action: Piece cannot overlap another piece."
                    );
                }
            }
        }
    },

    validate_pieceFitsOnBoard: function (
        { location }: GamePlayAction,
        pieceData: number[][]
    ) {
        var pieceY = pieceData.length;
        var pieceX = pieceData[0].length;

        if (
            GAMEBOARD_SIZE < location.y + pieceY ||
            GAMEBOARD_SIZE < location.x + pieceX
        ) {
            throw new InvalidActionError(
                "Invalid action: Piece must fully fit on game board."
            );
        }
    },

    validate_pieceTouchesDiagonally: function (
        boardState: Readonly<BoardState>,
        { location: { x, y }, playerId }: GamePlayAction,
        pieceData: number[][]
    ) {
        var pieceY = pieceData.length;
        var pieceX = pieceData[0].length;
        var foundMatch = false;
        for (var i = 0; i < pieceY; i++) {
            if (!foundMatch) {
                for (var j = 0; j < pieceX; j++) {
                    const cellToCheck = { x: x + j, y: y + i };
                    if (
                        pieceData[i][j] == 1 &&
                        MoveValidations.cellTouchesPlayedPieceDiagonally(
                            boardState,
                            cellToCheck,
                            playerId
                        )
                    ) {
                        foundMatch = true;
                        break;
                    }
                }
            }
        }

        if (!foundMatch) {
            throw new InvalidActionError(
                "Invalid action: Piece must touch your own piece diagonally"
            );
        }
    },

    validate_pieceDoesntTouchAdjacently: function (
        boardState: Readonly<BoardState>,
        { location: { x, y }, playerId }: GamePlayAction,
        pieceData: number[][]
    ) {
        var pieceY = pieceData.length;
        var pieceX = pieceData[0].length;
        let isValid = true;

        for (var i = 0; i < pieceY; i++) {
            if (isValid) {
                for (var j = 0; j < pieceX; j++) {
                    if (pieceData[i][j] == 1) {
                        const cellToCheck = { x: x + j, y: y + i };
                        if (
                            !MoveValidations.cellDoesntTouchPlayedPieceAdjacently(
                                boardState,
                                cellToCheck,
                                playerId
                            )
                        ) {
                            isValid = false;
                            break;
                        }
                    }
                }
            }
        }

        if (!isValid) {
            throw new InvalidActionError(
                "Invalid action: Piece must not touch your own piece adjacently"
            );
        }
    },

    validate_ifFirstMove_pieceIsInCorner: function (
        { location: { x, y } }: GamePlayAction,
        pieceData: number[][]
    ) {
        var pieceY = pieceData.length;
        var pieceX = pieceData[0].length;
        if (
            !(
                (pieceData[0][0] == 1 && x == 0 && y == 0) ||
                (pieceData[pieceY - 1][pieceX - 1] == 1 &&
                    x + pieceX == GAMEBOARD_SIZE &&
                    y + pieceY == GAMEBOARD_SIZE) ||
                (pieceData[0][pieceX - 1] == 1 &&
                    x + pieceX == GAMEBOARD_SIZE &&
                    y == 0) ||
                (pieceData[pieceY - 1][0] == 1 &&
                    y + pieceY == GAMEBOARD_SIZE &&
                    x == 0)
            )
        ) {
            throw new InvalidActionError(
                "If it is your first turn, make sure your piece touches a corner."
            );
        }
    },

    validateGamePlayAction: function (
        boardState: Readonly<BoardState>,
        action: GamePlayAction,
        isFirstMove: boolean
    ) {
        const pieceData = applyPieceModifications(
            GamePiecesData[action.piece],
            action.rotate,
            action.flip
        );

        MoveValidations.validate_pieceFitsOnBoard(action, pieceData);

        if (isFirstMove) {
            MoveValidations.validate_ifFirstMove_pieceIsInCorner(
                action,
                pieceData
            );
        } else {
            MoveValidations.validate_pieceTouchesDiagonally(
                boardState,
                action,
                pieceData
            );
        }

        MoveValidations.validate_pieceDoesntOverlapExistingPiece(
            boardState,
            action,
            pieceData
        );
        MoveValidations.validate_pieceDoesntTouchAdjacently(
            boardState,
            action,
            pieceData
        );
    }
};
