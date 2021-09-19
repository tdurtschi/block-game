import * as SockJS from "sockjs-client";
import { fork, ChildProcess } from "child_process";
import GameStatus from "../../src/shared/types/GameStatus";

const PORT = 9999;

describe("Remote Server", () => {
    describe("A SockJS client", () => {
        let server: ChildProcess;
        beforeAll(async () => {
            server = await setupServer(PORT);
        });

        afterAll(async (done) => {
            server.kill();

            server.on("exit", done);
        });

        it("Successfully connects to server", (done) => {
            var isSuccess: boolean = false;
            var sock = new SockJS(`http://localhost:${PORT}/games`);
            sock.onopen = function () {
                sock.close();
                isSuccess = true;
                done();
            };

            sock.onerror = function () {
                sock.close();
                !isSuccess && fail("Couldn't connect to server");
                done();
            };

            sock.onclose = function () {
                sock.close();
                !isSuccess && fail("Couldn't connect to server");
                done();
            };
        });

        it("Can retrieve a list of games", (done) => {
            var sock = new SockJS(`http://localhost:${PORT}/games`);
            sock.onopen = function () {};

            sock.onmessage = function (ev: MessageEvent) {
                const result = JSON.parse(ev.data);
                expect(result.length).toBeDefined();

                sock.close();
                done();
            };
        });

        it("Can create a new game", (done) => {
            var sock = new SockJS(`http://localhost:${PORT}/games`);
            let isFirstMessage = true;
            sock.onopen = function () {
                sock.send("NEW_GAME");
            };

            sock.onmessage = function (ev: MessageEvent) {
                const result = JSON.parse(ev.data);
                if (!isFirstMessage) {
                    expect(result.length).toEqual(1);
                    expect(result[0].id).toBeDefined();

                    sock.close();
                    done();
                }
                isFirstMessage = false;
            };
        });

        it("Can subscribe to a created new game", (done) => {
            var gamesSock = new SockJS(`http://localhost:${PORT}/games`);

            gamesSock.onmessage = function (ev: MessageEvent) {
                const result = JSON.parse(ev.data);
                const gameIdToJoin = result[0].id;

                var gameSock = new SockJS(`http://localhost:${PORT}/game`);
                gameSock.onopen = function () {
                    gameSock.send(
                        JSON.stringify({ kind: "SUBSCRIBE", id: gameIdToJoin })
                    );
                };

                gameSock.onmessage = function (ev: MessageEvent) {
                    const message = JSON.parse(ev.data);
                    expect(message.id).toEqual(gameIdToJoin);
                    expect(message.status).toEqual(GameStatus.CREATED);

                    gamesSock.close();
                    done();
                };
            };
        });
    });
});

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
