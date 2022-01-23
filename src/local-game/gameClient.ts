import { AIPlayer } from "../ai-player/ai-player";
import LocalGameServer from "./localGameServer";
import Action from "../shared/types/Actions";
import GameState from "../shared/types/GameState";
import { PlayerConfig } from "./playerConfig";

export interface IGameClient {
    action: (payload: Action) => any;
    registerPlayer: (player: PlayerConfig) => any;
    startGame: () => any;
    newGame: () => any;
    subscribe: (onUpdate: (gameState: Readonly<GameState>) => any) => any;
}

class GameClient implements IGameClient {
    private gameId: number | undefined;  

    constructor(private server: LocalGameServer) {}

    newGame() {
        const result = this.server.newGame();
        this.gameId = result.id;
        return result;
    }

    registerPlayer(player: PlayerConfig) {
        if(this.gameId === undefined) throw new Error("Tried to register player without gameId. 😭 This should never happen!");

        const playerId = this.server.registerPlayer(this.gameId, player.name);
        
        if(player.isAI){
            new AIPlayer(this, playerId);
        }
    }

    startGame() {
        if(this.gameId === undefined) throw new Error("Tried to start game without gameId. 😭 This should never happen!");

        this.server.startGame(this.gameId);
    }

    subscribe(onUpdate: (gameState: Readonly<GameState>) => any) {
        if(this.gameId === undefined) throw new Error("Can't subscribe without creating a new game.");
        return this.server.subscribe(this.gameId, onUpdate);
    }

    action(payload: Action) {
        if (this.gameId == undefined) throw new Error("No Game Exists!");

        return this.server.action(this.gameId, payload);
    }
}

export default GameClient;
