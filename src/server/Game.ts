import GameStatus from "./GameStatus";

class Game {
    constructor(
        public id: number,
        public status: GameStatus = GameStatus.CREATED
    ) { }
}

export default Game;