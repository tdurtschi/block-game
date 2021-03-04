import GameStatus from "./GameStatus";
import Player from "./Player";

class Game {
    constructor(
        public id: number,
        public status: GameStatus = GameStatus.CREATED,
        public players: Player[] = [],
    ) {
        this.players = [new Player(1)];
    }
}

export default Game;