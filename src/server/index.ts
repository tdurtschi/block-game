import Action from "../shared/types/Actions";
import Game from "./Game";
import GameState from "../shared/types/GameState";

type UpdateCallback = (gameState: Readonly<GameState>) => any;

class GameServer {
    private games: Map<number, Game> = new Map<number, Game>();
    private subscribers: UpdateCallback[]; 

    constructor() {
        this.subscribers = []
    }

    newGame() {
        const game = new Game(0);
        this.games.set(game.id, game);
        return game.getState();
    }

    registerPlayer(name: string) {
        const game = this.getGame();
        const playerId = game.registerPlayer(name);
        this.sendUpdate(game.getState());
        return playerId;
    }

    startGame() {
        const game = this.getGame();
        
        game.start();
        this.sendUpdate(game.getState());
    }

    subscribe(onUpdate: (gameState: Readonly<GameState>) => any) {
        this.subscribers.push(onUpdate);
    }

    action(gameId: number, payload: Action) {
        const game = this.games.get(gameId);
        if (game) {
            try {
                game.action(payload);
                this.sendUpdate(game.getState());
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

    private sendUpdate(gameState: GameState) {
        this.subscribers.forEach(callback => callback(gameState));
    }
}

export default GameServer;
