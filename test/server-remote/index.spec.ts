import * as SockJS from "sockjs-client";
import { fork, ChildProcess } from "child_process";
import GameStatus from "../../src/shared/types/GameStatus";
import Action, { GamePlayAction } from "../../src/shared/types/Actions";
import PlayerState from "../../src/shared/types/PlayerState";
import GameState from "../../src/shared/types/GameState";

const PORT = 9999;

describe("SockJS Server", () => {
    let server: ChildProcess;
    beforeAll(async () => {
        server = await setupServer(9999);
    });

    afterAll(async (done) => {
        server.kill();

        server.on("exit", done);
    });

    describe("Viewing and creating games", () => {
        it("Successfully connects to server", async () => {
            const client = new TestClient("games");
            await client.connected();
        });

        it("Can retrieve a list of games", async () => {
            const client = new TestClient("games");

            const message = await client.getNextMessage();
            expect(message.length).toBeDefined();
        });

        it("Can create a new game", async () => {
            const client = new TestClient("games");

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
            const gamesClient = new TestClient("games");
            const message = await gamesClient.getNextMessage();
            gameId = message[0].id;

            gameClient = new TestClient("game");
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
});

type GameMessage =
    | {
          kind: "SUBSCRIBE";
          id: number;
      }
    | {
          kind: "REGISTER";
          id: number;
          playerName: string;
      }
    | {
          kind: "START";
          id: number;
      }
    | {
          kind: "ACTION";
          id: number;
          action: Action;
      };

const setupServer = (port: number): Promise<ChildProcess> => {
    const env = {
        PORT: port.toString(),
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

class TestClient<TMessageType = any> {
    public sock: WebSocket;
    public messageQueue: string[] = [];
    constructor(prefix: string) {
        this.sock = new SockJS(`http://localhost:${PORT}/${prefix}`);
        this.sock.onmessage = this.onmessage;
    }

    connected() {
        return new Promise((resolve) => {
            this.sock.onopen = resolve;
        });
    }

    send(data: TMessageType) {
        this.sock.send(JSON.stringify(data));
    }

    getNextMessage(): Promise<any> {
        if (this.messageQueue.length > 0) {
            return new Promise((resolve) => resolve(this.messageQueue.shift()));
        } else {
            return new Promise((resolve) => {
                this.sock.onmessage = (ev) => {
                    resolve(JSON.parse(ev.data));

                    this.sock.onmessage = this.onmessage;
                };
            });
        }
    }

    private onmessage = (ev: MessageEvent) => {
        this.messageQueue.push(ev.data);
    };
}
