import Action, { GamePlayAction } from "../shared/types/Actions";
import GameStatus from "../shared/types/GameStatus";
import InvalidActionError from "./errors/InvalidActionError";
import Player from "./Player";
import PlayerId from "../shared/types/PlayerId";
import { GamePiecesData } from "../shared/types/GamePiece";
import {
    applyPieceToBoard,
    clone,
    rotate as applyRotate,
    flip as applyFlip
} from "../shared/pieceUtils";
import GameState from "../shared/types/GameState";
import BoardState from "../shared/types/BoardState";

const GAMEBOARD_SIZE = 20;

class Game {
    public currentPlayer: PlayerId = 1;
    public boardState: (PlayerId | undefined)[][];
    public status: GameStatus = GameStatus.CREATED;
    public players: Player[];

    constructor(
        public id: number,
        public playerNames: {name: string}[] = []
    ) {
        this.players = [
            new Player(1, playerNames[0]?.name ?? "Player 1"),
            new Player(2, playerNames[1]?.name ?? "Player 2"),
            new Player(3, playerNames[2]?.name ?? "Player 3"),
            new Player(4, playerNames[3]?.name ?? "Player 4")
        ];

        this.boardState = createInitialBoardState();
    }

    public action(payload: Action) {
        const action = payload;
        if (this.currentPlayer == payload.playerId) {
            if (action.kind == "Pass") {
                this.passAction(action.playerId);
            } else if (action.kind == "GamePlay") {
                this.throwErrorIfActionInvalid(action);
                this.applyPieceToGameBoard(action);
                if (this.getPlayer(action.playerId).isOutOfPieces()) {
                    this.passAction(action.playerId);
                }
            }
            this.currentPlayer = this.getPlayerForNextTurn();
        } else {
            throw new InvalidActionError(
                `It is player ${this.currentPlayer}'s turn.`
            );
        }
    }

    public getPlayer(playerId: PlayerId) {
        return this.players[playerId - 1];
    }

    allPlayersPassed() {
        return (
            this.getPlayer(1).hasPassed &&
            this.getPlayer(2).hasPassed &&
            this.getPlayer(3).hasPassed &&
            this.getPlayer(4).hasPassed
        );
    }

    public getState(): Readonly<GameState> {
        return {
            id: this.id,
            currentPlayer: this.currentPlayer,
            players: this.players.map((player) => player.getState()),
            boardState: this.boardState,
            status: this.status
        };
    }

    applyPieceToGameBoard({
        location,
        piece,
        playerId,
        rotate,
        flip
    }: GamePlayAction) {
        const modifiedPiece = applyPieceModifications(
            GamePiecesData[piece],
            rotate,
            flip
        );
        this.boardState = applyPieceToBoard(
            location,
            modifiedPiece,
            playerId,
            this.boardState
        );

        const player = this.getPlayer(playerId);
        player.playerPieces = player.playerPieces.filter(
            (playerPiece) => playerPiece.id != piece
        );
    }

    getPlayerForNextTurn(): PlayerId {
        const validPlayers = [1, 2, 3, 4].filter(
            (playerId) =>
                playerId === this.currentPlayer ||
                !this.getPlayer(playerId as PlayerId).hasPassed
        );
        const playerIdx = validPlayers.findIndex(
            (playerId) => playerId === this.currentPlayer
        );
        const nextPlayer = validPlayers[
            (playerIdx + 1) % validPlayers.length
        ] as PlayerId;
        return nextPlayer;
    }

    private passAction(playerId: PlayerId) {
        this.getPlayer(playerId).pass();
        if (this.allPlayersPassed()) {
            this.status = GameStatus.OVER;
        }
    }

    private throwErrorIfActionInvalid(action: GamePlayAction) {
        const { piece, rotate, flip } = action;

        const pieceData = applyPieceModifications(
            GamePiecesData[piece],
            rotate,
            flip
        );

        this.validate_ifFirstMove_pieceIsInCorner(action, pieceData);
        this.validate_pieceDoesntOverlapExistingPiece(action, pieceData);
        this.validate_pieceFitsOnBoard(action, pieceData);
        this.validate_pieceTouchesDiagonally(action, pieceData);
        this.validate_pieceDoesntTouchAdjacently(action, pieceData);
    }

    private validate_ifFirstMove_pieceIsInCorner(
        { location: { x, y }, playerId }: GamePlayAction,
        pieceData: number[][]
    ) {
        if (!this.getPlayer(playerId).isFirstTurn()) {
            return;
        }

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
    }

    private validate_pieceDoesntOverlapExistingPiece(
        { location }: GamePlayAction,
        pieceData: number[][]
    ) {
        var pieceY = pieceData.length;
        var pieceX = pieceData[0].length;
        for (var i = 0; i < pieceY; i++) {
            for (var j = 0; j < pieceX; j++) {
                if (
                    pieceData[i][j] !== 0 &&
                    this.boardState[location.y + i][location.x + j] !==
                        undefined
                ) {
                    throw new InvalidActionError(
                        "Invalid action: Piece cannot overlap another piece."
                    );
                }
            }
        }
    }

    private validate_pieceFitsOnBoard(
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
    }

    private validate_pieceTouchesDiagonally(
        { location: { x, y }, playerId }: GamePlayAction,
        pieceData: number[][]
    ) {
        if (this.getPlayer(playerId).isFirstTurn()) {
            return;
        }

        var pieceY = pieceData.length;
        var pieceX = pieceData[0].length;
        var foundMatch = false;
        for (var i = 0; i < pieceY; i++) {
            if (!foundMatch) {
                for (var j = 0; j < pieceX; j++) {
                    if (
                        pieceData[i][j] == 1 &&
                        ((y + i + 1 < this.boardState.length &&
                            x + j + 1 < this.boardState[0].length &&
                            this.boardState[y + i + 1][x + j + 1] ==
                                playerId) ||
                            (y + i + 1 < this.boardState.length &&
                                x + j > 0 &&
                                this.boardState[y + i + 1][x + j - 1] ==
                                    playerId) ||
                            (y + i > 0 &&
                                x + j + 1 < this.boardState[0].length &&
                                this.boardState[y + i - 1][x + j + 1] ==
                                    playerId) ||
                            (y + i > 0 &&
                                x + j > 0 &&
                                this.boardState[y + i - 1][x + j - 1] ==
                                    playerId))
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
    }

    private validate_pieceDoesntTouchAdjacently(
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
                        //check above
                        if (
                            y + i > 0 &&
                            this.boardState[y + i - 1][x + j] == playerId
                        ) {
                            isValid = false;
                            break;
                        }

                        //check right
                        if (
                            x + j + 1 < this.boardState[0].length &&
                            this.boardState[y + i][x + j + 1] == playerId
                        ) {
                            isValid = false;
                            break;
                        }

                        //check below
                        if (
                            y + i + 1 < this.boardState.length &&
                            this.boardState[y + i + 1][x + j] == playerId
                        ) {
                            isValid = false;
                            break;
                        }

                        //check left
                        if (
                            x + j > 0 &&
                            this.boardState[y + i][x + j - 1] == playerId
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
    }
}

export default Game;

function createInitialBoardState(): BoardState {
    const rows = GAMEBOARD_SIZE;
    const columns = GAMEBOARD_SIZE;
    const rowArray: PlayerId[][] = new Array(rows).fill([]);
    const result = rowArray.map(() => new Array(columns).fill(undefined));
    return result;
}

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
