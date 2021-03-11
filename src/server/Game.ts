import Action, { BoardLocation, GamePlayAction } from "../shared/types/Actions";
import GameStatus from "../shared/types/GameStatus";
import InvalidActionError from "./errors/InvalidActionError";
import Player from "./Player";
import PlayerId from "./PlayerId";
import { GamePiecesData } from "../shared/types/GamePiece";
import { applyPieceToBoard, clone, rotate } from "../shared/pieceUtils";

type BoardState = (PlayerId | undefined)[][];

type GameState = {
    id: number,
    boardState: Readonly<BoardState>,
    currentPlayer: Readonly<PlayerId>,
    players: Readonly<Player[]>,
    status: GameStatus
}

class Game {
    public currentPlayer: PlayerId = 1;
    public boardState: (PlayerId | undefined)[][];

    constructor(
        public id: number,
        public status: GameStatus = GameStatus.CREATED,
        public players: Player[] = [],
    ) {
        this.players = [
            new Player(1),
            new Player(2),
            new Player(3),
            new Player(4)
        ];

        this.boardState = createInitialBoardState();
    }

    public action(payload: Action) {
        const action = payload;
        if (this.currentPlayer == payload.playerId) {
            if (action.kind == "Pass") {
                this.getPlayer(action.playerId).pass();
                if (this.allPlayersPassed()) {
                    this.status = GameStatus.OVER;
                }
            } else if (action.kind == "GamePlay") {
                if (this.moveIsValid(action)) {
                    this.applyPiece(action);
                } else {
                    throw new InvalidActionError();
                }
            }
            this.currentPlayer = ((this.currentPlayer % 4) + 1 as PlayerId);
        }
        else {
            throw new InvalidActionError();
        }
    }

    public getPlayer(playerId: PlayerId) {
        return this.players[playerId - 1];
    }

    allPlayersPassed() {
        return this.getPlayer(1).hasPassed &&
            this.getPlayer(2).hasPassed &&
            this.getPlayer(3).hasPassed &&
            this.getPlayer(4).hasPassed
    }

    public getState(): Readonly<GameState> {
        return {
            id: this.id,
            currentPlayer: this.currentPlayer,
            players: this.players,
            boardState: this.boardState,
            status: this.status
        }
    }

    moveIsValid({ location, piece, rotate, flip }: GamePlayAction) {
        let isValid = true;
        const pieceData = applyPieceModifications(GamePiecesData[piece], rotate, flip);
        var pieceY = pieceData.length;
        var pieceX = pieceData[0].length;
        for (var i = 0; i < pieceY; i++) {
            for (var j = 0; j < pieceX; j++) {
                if (pieceData[i][j] !== 0 && this.boardState[location.y + i][location.x + j] !== undefined) {
                    return false;
                }
            }
        }
        return isValid;
    }

    applyPiece({ location, piece, playerId, rotate, flip }: GamePlayAction) {
        const modifiedPiece = applyPieceModifications(GamePiecesData[piece], rotate, flip);
        this.boardState = applyPieceToBoard(location, modifiedPiece, playerId, this.boardState);

        const player = this.getPlayer(playerId);
        player.playerPieces = player.playerPieces.filter(playerPiece => playerPiece.id != piece);
    }
}

export type { GameState, BoardState };
export default Game;

function createInitialBoardState(): BoardState {
    const rows = 20;
    const columns = 20;
    const rowArray: PlayerId[][] = new Array(rows).fill([]);
    const result = rowArray.map(() => new Array(columns).fill(undefined));
    return result;
}

function applyPieceModifications(pieceData: number[][], rotation: 0 | 1 | 2 | 3, flip: boolean = false) {
    let result = clone(pieceData);
    if (rotation == 0) {
        return result;
    } else if (rotation == 1) {
        return rotate(result);
    } else if (rotation == 2) {
        return rotate(rotate(result));
    } else {
        return rotate(rotate(rotate(result)));
    }
}