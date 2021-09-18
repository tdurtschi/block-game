import * as http from "http";
import * as sockjs from "sockjs";

console.log("Running server");

class SockJSGameServer {
    listen(port: number) {
        const echo = sockjs.createServer({ prefix: "/echo" });
        echo.on("connection", function (conn) {
            conn.on("data", function (message) {
                conn.write(message);
            });
            conn.on("close", function () {});
        });

        const server = http.createServer();
        echo.installHandlers(server);
        console.log(`Server listening on port ${port}...`);
        server.listen(port);
    }
}

const port = parseInt(process.env.PORT || "9999");

new SockJSGameServer().listen(port);
