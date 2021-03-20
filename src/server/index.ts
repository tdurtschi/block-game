import Action from "../shared/types/Actions";
import Game from "./Game";
import GameNotFoundError from "./errors/GameNotFoundError";
import GameState from "../shared/types/GameState";

class GameServer {
    private games: Map<number, Game> = new Map<number, Game>()
    private onUpdate: (gameState: Readonly<GameState>) => any;

    constructor() {
        this.onUpdate = () => { }
    }

    newGame() {
        const game = new Game(0);
        this.games.set(game.id, game);
        return game.getState();
    }

    subscribe(onUpdate: (gameState: Readonly<GameState>) => any) {
        this.onUpdate = onUpdate;
    }

    action(id: number, payload: Action) {
        const game = this.games.get(id);
        if (game) {
            game.action(payload);
            this.onUpdate(game.getState());
        } else {
            throw new GameNotFoundError();
        }
    }
}

export default GameServer;