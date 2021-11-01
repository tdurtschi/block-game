import Action from "../shared/types/Actions";
import GameState from "../shared/types/GameState";
import { GameMessage } from "./game-message";
import { GamesMessage } from "./games-message";
import { WSClient } from "./wsClient";

export interface IOnlineGamesClient {
    connect: (
        onGamesUpdate: (games: GamesMessage) => any,
        onGameUpdate: (state: GameState) => any
    ) => Promise<any>;
    createGame: () => any;
    joinGame: (gameId: number, playerName: string) => any;
    startGame: (gameId: number) => any;
    gameAction: (action: Action) => any;
}

export class OnlineGamesClient {
    private gamesConnection: WSClient<any, GamesMessage> | undefined;
    private gameConnection: WSClient<GameMessage, any> | undefined;
    private onGameUpdate: ((state: GameState) => any) | undefined;
    private gameId: number = 0;

    public connect(
        onGamesUpdate: (games: GamesMessage) => any,
        onGameUpdate: (state: GameState) => any
    ) {
        this.gamesConnection = new WSClient<any>("games", onGamesUpdate);
        this.onGameUpdate = onGameUpdate;
        return this.gamesConnection.connected();
    }

    createGame() {
        this.gamesConnection?.send("NEW_GAME");
    }

    async joinGame(gameId: number, playerName: string) {
        this.gameId = gameId;
        this.gameConnection = new WSClient<GameMessage, any>("game", this.onGameUpdate!);
        await this.gameConnection.connected();
        
        this.gameConnection.send({ kind: "SUBSCRIBE", id: this.gameId });
        this.gameConnection.send({
            kind: "REGISTER",
            id: this.gameId,
            playerName
        });
    }

    gameAction(action: Action) {
        this.gameConnection.send({ kind: "ACTION", id: this.gameId, action });
    }

    startGame(gameId: number) {
        this.gameConnection?.send({
            kind: "REGISTER",
            id: gameId,
            playerName: "Dummy"
        });
        this.gameConnection?.send({
            kind: "REGISTER",
            id: gameId,
            playerName: "Dummy"
        });
        this.gameConnection?.send({
            kind: "REGISTER",
            id: gameId,
            playerName: "Dummy"
        });
        this.gameConnection?.send({
            kind: "START",
            id: gameId
        });
    }
}
