import Game from "./Game";

class GameServer {
    private games: Map<number, Game> = new Map<number, Game>()

    constructor() {

    }

    newGame() {
        const game = new Game(0);
        this.games.set(game.id, game);
        return game;
    }

    getGame(id: number) {
        return this.games.get(id);
    }
}

export default GameServer;