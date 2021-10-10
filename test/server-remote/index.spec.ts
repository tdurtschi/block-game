import { fork, ChildProcess } from "child_process";
import GameStatus from "../../src/shared/types/GameStatus";
import PlayerState from "../../src/shared/types/PlayerState";
import GameState from "../../src/shared/types/GameState";
import { GameMessage } from "../../src/server-remote/game-message";
import { TestClient } from "./testClient";

const SERVER_PORT = 9999;

describe("SockJS Server", () => {
    let server: ChildProcess;
    beforeAll(async () => {
        server = await setupServer(SERVER_PORT);
    });

    afterAll(async (done) => {
        server.kill();

        server.on("exit", done);
    });
    describe("Viewing and creating games", () => {
        it("Successfully connects to server", async () => {
            const client = new TestClient("games", SERVER_PORT);
            await client.connected();
        });

        it("Can retrieve a list of games", async () => {
            const client = new TestClient("games", SERVER_PORT);

            const message = await client.getNextMessage();
            expect(message.length).toBeDefined();
        });

        it("Can create a new game", async () => {
            const client = new TestClient("games", SERVER_PORT);

            await client.getNextMessage();
            client.send("NEW_GAME");
            const message = await client.getNextMessage();
            expect(message.length).toEqual(1);
            expect(message[0].id).toBeDefined();
        });
    });

    describe("Setting up and playing a single game", () => {
        let gameClient: TestClient<GameMessage>;
        let gameId: number;
        beforeAll(async () => {
            const gamesClient = new TestClient("games", SERVER_PORT);
            const message = await gamesClient.getNextMessage();
            gameId = message[0].id;

            gameClient = new TestClient("game", SERVER_PORT);
            await gameClient.connected();
        });

        it("Can subscribe to a created game", async () => {
            gameClient.send({ kind: "SUBSCRIBE", id: gameId });

            const result = await gameClient.getNextMessage();

            expect(result.id).toEqual(gameId);
            expect(result.status).toEqual(GameStatus.CREATED);
        });

        it("Can register a player to a game", async () => {
            gameClient.send({
                kind: "REGISTER",
                id: gameId,
                playerName: "Joe Biden"
            });

            const result = await gameClient.getNextMessage();
            expect(
                result.players.find(
                    (player: PlayerState) => player.name === "Joe Biden"
                )
            ).toBeDefined();
        });

        it("Can start a game with 4 players", async () => {
            gameClient.send({
                kind: "REGISTER",
                id: gameId,
                playerName: "Jill Biden"
            });
            await gameClient.getNextMessage();
            gameClient.send({
                kind: "REGISTER",
                id: gameId,
                playerName: "Bo Biden"
            });
            await gameClient.getNextMessage();
            gameClient.send({
                kind: "REGISTER",
                id: gameId,
                playerName: "Mo Biden"
            });
            await gameClient.getNextMessage();
            gameClient.send({
                kind: "START",
                id: gameId
            });

            const result: GameState = await gameClient.getNextMessage();
            expect(result.status).toEqual(GameStatus.STARTED);
        });

        it("Can send a gameplay action to a game and get the resulting state", async () => {
            gameClient.send({
                kind: "ACTION",
                id: gameId,
                action: {
                    kind: "Pass",
                    playerId: 1
                }
            });

            const result: GameState = await gameClient.getNextMessage();
            expect(result.currentPlayerId).toEqual(2);
        });
    });

    describe("Multiple clients", () => {
        it("Sends game list updates to multiple clients", async () => {
            const gamesClient1 = new TestClient("games", SERVER_PORT);
            const gamesClient2 = new TestClient("games", SERVER_PORT);
            await Promise.all([
                gamesClient1.connected(),
                gamesClient2.connected()
            ]);

            gamesClient1.send("NEW_GAME");
            await gamesClient2.getNextMessage();
        });

        it("Sends game updates to multiple clients", async () => {
            const client = new TestClient("games", SERVER_PORT);

            await client.getNextMessage();
            client.send("NEW_GAME");
            const message = await client.getNextMessage();
            const gameId = message[message.length - 1].id;

            const gameClient1 = new TestClient("game", SERVER_PORT);
            const gameClient2 = new TestClient("game", SERVER_PORT);
            await Promise.all([
                gameClient1.connected(),
                gameClient2.connected()
            ]);

            gameClient1.send({ kind: "SUBSCRIBE", id: gameId });
            await gameClient1.getNextMessage();
            gameClient2.send({ kind: "SUBSCRIBE", id: gameId });
            await gameClient2.getNextMessage();

            gameClient1.send({
                kind: "REGISTER",
                id: gameId,
                playerName: "Jill Biden"
            });

            await gameClient2.getNextMessage();
        });
    });
});

const setupServer = (port: number): Promise<ChildProcess> => {
    const env = {
        SERVER_PORT: port.toString(),
        FILENAME: "../../src/server-remote/index.ts"
    };
    return new Promise((resolve, reject) => {
        const process = fork(
            "./test/server-remote/worker-thread-ts-adapter.js",
            [],
            { env }
        );

        process.on("spawn", () => {
            console.log("Lol spawned the thing");
        });
        setTimeout(() => resolve(process), 2500);

        process.on("error", (err: Error) => {
            console.log(err);
            reject(err);
        });
    });
};
