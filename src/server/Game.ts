import Action from "./Action";
import GameStatus from "./GameStatus";
import InvalidActionError from "./InvalidActionError";
import Player from "./Player";
import PlayerId from "./PlayerId";

class Game {
    public currentPlayer: PlayerId = 1;
    public isOver: boolean = false;

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
    }

    public action(payload: Action) {
        const action = payload;
        if (this.currentPlayer == payload.playerId) {
            this.currentPlayer = ((this.currentPlayer % 4) + 1 as PlayerId);
            if (action.kind = "Pass") {
                this.getPlayer(action.playerId).pass();
                if (this.allPlayersPassed()) {
                    this.isOver = true;
                }
            }
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

    public getState() {
        return {
            currentPlayer: this.currentPlayer,
            isOver: this.isOver,
            players: this.players
        }
    }
}

export default Game;