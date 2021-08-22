import { AIPlayer } from "../ai-player/ai-player";
import GameServer from "../server";
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

    constructor(private server: GameServer) {}

    newGame() {
        const result = this.server.newGame();
        this.gameId = result.id;
        return result;
    }

    registerPlayer(player: PlayerConfig) {
        const playerId = this.server.registerPlayer(player.name);
        
        if(player.isAI){
            new AIPlayer(this, playerId);
        }
    }

    startGame() {
        this.server.startGame();
    }

    subscribe(onUpdate: (gameState: Readonly<GameState>) => any) {
        return this.server.subscribe(onUpdate);
    }

    action(payload: Action) {
        if (this.gameId == undefined) throw new Error("No Game Exists!");

        return this.server.action(this.gameId, payload);
    }
}

export default GameClient;
