import GameState from "../shared/types/GameState";
import { WSClient } from "./wsClient";

export type GamesMessage = any[];

export interface IOnlineGamesClient {
    connect: (
        onGamesUpdate: (games: GamesMessage) => any,
        onGameUpdate: (state: GameState) => any
    ) => Promise<any>;
    createGame: () => any;
    joinGame: (gameId: number, playerName: string) => any;
    startGame: (gameId: number) => any;
}

export class OnlineGamesClient {
    private gamesConnection: WSClient<any> | undefined;
    private gameConnection: WSClient<any> | undefined;
    private onGameUpdate: ((state: GameState) => any) | undefined;

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
        this.gameConnection = new WSClient<any>("game", this.onGameUpdate!);
        await this.gameConnection.connected();
        this.gameConnection.send({ kind: "SUBSCRIBE", id: gameId });
        this.gameConnection.send({
            kind: "REGISTER",
            id: gameId,
            playerName
        });
        this.gameConnection.send({
            kind: "REGISTER",
            id: gameId,
            playerName: "Dummy"
        });
        this.gameConnection.send({
            kind: "REGISTER",
            id: gameId,
            playerName: "Dummy"
        });
        this.gameConnection.send({
            kind: "REGISTER",
            id: gameId,
            playerName: "Dummy"
        });
    }

    startGame(gameId: number) {
        this.gameConnection?.send({
            kind: "START",
            id: gameId
        });
    }
}