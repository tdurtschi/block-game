import Action, { GamePlayAction } from "./types/Actions";
import GameStatus from "./types/GameStatus";
import InvalidActionError from "../server-local/errors/InvalidActionError";
import Player from "./Player";
import PlayerId from "./types/PlayerId";
import { GamePiecesData } from "./types/GamePiece";
import {
    applyPieceToBoard,
    applyPieceModifications
} from "./pieceUtils";
import GameState from "./types/GameState";
import BoardState from "./types/BoardState";
import { MoveValidations } from "./moveValidations";
import { GAMEBOARD_SIZE } from "./constants";

class Game {
    public currentPlayerId: PlayerId = 1;
    public boardState: (PlayerId | undefined)[][];

    constructor(
        public id: number,
        public status: GameStatus = GameStatus.CREATED,
        public players: Player[] = []
    ) {
        this.boardState = createInitialBoardState();
    }

    action(payload: Action) {
        if (this.status !== GameStatus.STARTED)
            throw new Error(
                "Cannot perform game action if game.status != STARTED"
            );

        const action = payload;
        if (this.currentPlayerId == payload.playerId) {
            if (action.kind == "Pass") {
                this.passAction(action.playerId);
            } else if (action.kind == "GamePlay") {
                this.throwErrorIfActionInvalid(action);
                this.applyPieceToGameBoard(action);
                if (this.getPlayer(action.playerId).isOutOfPieces()) {
                    this.passAction(action.playerId);
                }
            }
            this.currentPlayerId = this.getPlayerForNextTurn();
        } else {
            throw new InvalidActionError(
                `It is player ${this.currentPlayerId}'s turn.`
            );
        }
    }

    getPlayer(playerId: PlayerId) {
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

    getState(): Readonly<GameState> {
        return {
            id: this.id,
            currentPlayerId: this.currentPlayerId,
            players: this.players.map((player) => player.getState()),
            boardState: this.boardState,
            status: this.status
        };
    }

    registerPlayer(playerName: string) {
        if (this.players.length >= 4)
            throw new Error("Tried to register too many players (4 maximum)!");
        const newPlayerId = (this.players.length + 1) as PlayerId;
        this.players.push(new Player(newPlayerId, playerName));
        return newPlayerId;
    }

    start() {
        if (this.players.length !== 4) {
            throw new Error("Cannot start game before registering 4 players.");
        }

        this.status = GameStatus.STARTED;
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

    private getPlayerForNextTurn(): PlayerId {
        const validPlayers = [1, 2, 3, 4].filter(
            (playerId) =>
                playerId === this.currentPlayerId ||
                !this.getPlayer(playerId as PlayerId).hasPassed
        );
        const playerIdx = validPlayers.findIndex(
            (playerId) => playerId === this.currentPlayerId
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
        const isFirstMove = this.getPlayer(action.playerId).isFirstTurn();
        MoveValidations.validateGamePlayAction(
            this.boardState,
            action,
            isFirstMove
        );
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
