import GameServer from "../server";
import Action from "../shared/types/Actions";
import GameState from "../shared/types/GameState";

export interface IGameClient {
    newGame: () => any
    subscribe: (onUpdate: (gameState: Readonly<GameState>) => any) => any
    action: (payload: Action) => any
}

class GameClient implements IGameClient {
    private gameId: number | undefined;

    constructor(private server: GameServer) {
    }

    newGame() {
        const result = this.server.newGame();
        this.gameId = result.id;
        return result;
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