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
    canRejoinGame: () => boolean;
    rejoinGame: () => Promise<unknown>;
}

const RETRY_LENGTH = 5 * 60000; // 5 minutes * 60000 ms/min
const RETRY_TIMEOUT = 500;

export class OnlineGamesClient {
    private gamesConnection: WSClient<any, GamesMessage> | undefined;
    private gameConnection: WSClient<GameMessage, any> | undefined;
    private onGameUpdate: ((state: GameState) => any) | undefined;
    private gameId: number = 0;
    private connectionSucceeded!: (value: any) => any;
    private waitForConnection = new Promise((res) => {
        this.connectionSucceeded = res;
    });

    public connect(
        onGamesUpdate: (games: GamesMessage) => any,
        onGameUpdate: (state: GameState) => any
    ) {
        const connect = async () => {
            this.gamesConnection = new WSClient<any>("games", onGamesUpdate);
            this.onGameUpdate = onGameUpdate;
            await this.gamesConnection.connected();
        };

        return withRetry(connect, RETRY_LENGTH, RETRY_TIMEOUT).then(
            this.connectionSucceeded
        );
    }

    createGame() {
        this.gamesConnection?.send("NEW_GAME");
    }

    async joinGame(gameId: number, playerName: string) {
        await this.connectAndSubscribeToGame(gameId);

        this.gameConnection!.send({
            kind: "REGISTER",
            id: this.gameId,
            playerName
        });

        window.sessionStorage.setItem("onlineGame", `${gameId}`);
    }

    canRejoinGame() {
        const onlineGame = window.sessionStorage.getItem("onlineGame");
        return onlineGame !== null;
    }

    async rejoinGame() {
        if (this.canRejoinGame()) {
            const onlineGameId = window.sessionStorage.getItem("onlineGame")!;
            const gameId = parseInt(onlineGameId);

            await this.waitForConnection;
            this.connectAndSubscribeToGame(gameId);
        } else {
            throw new Error("Tried to rejoin game but couldn't find game ID");
        }
    }

    gameAction(action: Action) {
        this.gameConnection?.send({ kind: "ACTION", id: this.gameId, action });
        if (action.kind == "Pass") {
            window.sessionStorage.clear();
        }
    }

    startGame(gameId: number) {
        this.gameConnection?.send({
            kind: "START",
            id: gameId
        });
    }

    private async connectAndSubscribeToGame(gameId: number) {
        this.gameId = gameId;
        this.gameConnection = new WSClient<GameMessage, any>(
            "game",
            this.onGameUpdate!
        );
        await this.gameConnection.connected();

        this.gameConnection.send({ kind: "SUBSCRIBE", id: this.gameId });
    }
}

const withRetry = async (
    fn: () => Promise<any>,
    retryLength: number,
    retryTimeout: number
) => {
    const startTime = Date.now();
    const endTime = startTime + retryLength;
    let success = false;
    while (Date.now() < endTime && !success) {
        try {
            await fn();
            success = true;
        } catch (error) {
            await new Promise((r) => setTimeout(r, retryTimeout));
            if (Date.now() >= endTime) {
                console.error(error);

                throw error;
            }
        }
    }
};
