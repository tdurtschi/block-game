import { IGameClient } from "../game-client";
import GameState from "../shared/types/GameState";
import GameStatus from "../shared/types/GameStatus";
import PlayerId from "../shared/types/PlayerId";

export class AIPlayer {
    constructor(private gameClient: IGameClient, 
        private playerId: PlayerId) {
        gameClient.subscribe(this.onUpdate.bind(this));
    }
    
    private onUpdate(gameState: Readonly<GameState>) {
        if(gameState.status !== GameStatus.STARTED || gameState.currentPlayerId !== this.playerId) return;
        
        this.gameClient.action({
            kind: "Pass",
            playerId: this.playerId
        });
    }
}