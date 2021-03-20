import GameServer from "./server";
import Action from "./shared/types/Actions";
import GameState from "./shared/types/GameState";

class GameClient {
    constructor(private server: GameServer) {
    }

    newGame() {
        return this.server.newGame();
    }

    subscribe(onUpdate: (gameState: Readonly<GameState>) => any) {
        return this.server.subscribe(onUpdate);
    }

    action(id: number, payload: Action) {
        this.server.action(id, payload);
    }
}

export default GameClient;