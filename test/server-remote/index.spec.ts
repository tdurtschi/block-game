import * as SockJS from "sockjs-client";
import { fork, ChildProcess } from "child_process";

const PORT = 9999;

describe("Remote Server", () => {
    describe("A SockJS client", () => {
        let server: ChildProcess;
        beforeEach(async () => {
            server = await setupServer(PORT);
        });

        afterEach(() => {
            server.kill();
        });

        it("Successfully connects to server", (done) => {
            var sock = new SockJS(`http://localhost:${PORT}/echo`);
            sock.onopen = function () {
                sock.close();
                done();
            };

            sock.onerror = function () {
                sock.close();
                fail("Couldn't connect to server");
                done();
            };

            sock.onclose = function () {
                sock.close();
                fail("Couldn't connect to server");
                done();
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
