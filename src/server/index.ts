import Action from "../types/Actions";
import Game, { GameState } from "./Game";
import GameNotFoundError from "./errors/GameNotFoundError";

class GameServer {
    private games: Map<number, Game> = new Map<number, Game>()
    private onUpdate: (gameState: Readonly<GameState>) => any;

    constructor() {
        this.onUpdate = () => { }
    }

    newGame() {
        const game = new Game(0);
        this.games.set(game.id, game);
        return game;
    }

    subscribe(onUpdate: (gameState: Readonly<GameState>) => any) {
        this.onUpdate = onUpdate;
    }

    getGame(id: number) {
        return this.games.get(id);
    }

    action(id: number, payload: Action) {
        const game = this.games.get(id)
        if (game) {
            game.action(payload);
            this.onUpdate(game.getState())
        } else {
            throw new GameNotFoundError();
        }
    }
}

export default GameServer;