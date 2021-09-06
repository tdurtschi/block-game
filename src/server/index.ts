import Action from "../shared/types/Actions";
import Game from "./Game";
import GameState from "../shared/types/GameState";
import { generateId } from "./idGenerator";

type UpdateCallback = (gameState: Readonly<GameState>) => any;

class GameServer {
    private games: Map<number, Game> = new Map<number, Game>();
    private subscribers: Map<number, UpdateCallback[]> = new Map<number, UpdateCallback[]>(); 

    newGame() {
        const game = new Game(generateId());
        this.games.set(game.id, game);
        return game.getState();
    }

    registerPlayer(gameId: number, name: string) {
        const game = this.getGame(gameId);
        const playerId = game.registerPlayer(name);
        this.sendUpdate(game.getState());
        return playerId;
    }

    startGame(gameId: number) {
        const game = this.getGame(gameId);
        
        game.start();
        this.sendUpdate(game.getState());
    }

    subscribe(gameId: number, onUpdate: (gameState: Readonly<GameState>) => any) {
        const gameSubscribers = this.subscribers.get(gameId);
        if(gameSubscribers === undefined) {
            this.subscribers.set(gameId, [onUpdate]);
        } else {
            gameSubscribers.push(onUpdate);
        }
    }

    action(gameId: number, payload: Action) {
        const game = this.games.get(gameId);
        if (game) {
            try {
                game.action(payload);
                this.sendUpdate(game.getState());
                return {};
            } catch (error) {
                console.error(error);
                console.log(payload);
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

    private getGame(gameId: number): Game {
        const game = this.games.get(gameId);
        if(!game) throw new Error(`Couldn't find game with id: ${gameId}`);
        return game;
    }

    private sendUpdate(gameState: GameState) {
        const gameSubscribers = this.subscribers.get(gameState.id);
        if (gameSubscribers !== undefined) {
            gameSubscribers.forEach(callback => callback(gameState));
        }
    }
}

export default GameServer;
