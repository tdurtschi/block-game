import Action from "../shared/types/Actions";
import Game from "./Game";
import GameState from "../shared/types/GameState";

class GameServer {
    private games: Map<number, Game> = new Map<number, Game>();
    private onUpdate: (gameState: Readonly<GameState>) => any;

    constructor() {
        this.onUpdate = () => {};
    }

    newGame() {
        const game = new Game(0);
        this.games.set(game.id, game);
        return game.getState();
    }

    registerPlayer(name: string) {
        const game = this.getGame();
        game.registerPlayer(name);
        this.onUpdate(game.getState());
    }

    startGame() {
        const game = this.getGame();
        
        game.start();
        this.onUpdate(game.getState());
    }

    subscribe(onUpdate: (gameState: Readonly<GameState>) => any) {
        this.onUpdate = onUpdate;
    }

    action(gameId: number, payload: Action) {
        const game = this.games.get(gameId);
        if (game) {
            try {
                game.action(payload);
                this.onUpdate(game.getState());
                return {};
            } catch (error) {
                return {
                    errorMessage: error.message ?? "Unknown Error Occured"
                };
            }
        } else {
            return {
                errorMessage: "Game Not Found!"
            };
        }
    }

    private getGame(): Game {
        const game = this.games.get(0);
        if(!game) throw new Error(`Couldn't find game with id: 0`);
        return game;
    }
}

export default GameServer;
