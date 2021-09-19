import * as http from "http";
import * as sockjs from "sockjs";
import Game from "../shared/Game";
import { generateId } from "../shared/idGenerator";

class SockJSGameServer {
    private games: Map<number, Game> = new Map<number, Game>();

    listen(port: number) {
        const server = http.createServer();

        const games = sockjs.createServer({ prefix: "/games" });
        games.on("connection", this.handleNewGamesSubscriber.bind(this));
        games.installHandlers(server);

        const game = sockjs.createServer({ prefix: "/game" });
        game.on("connection", this.handleNewGameSubscriber.bind(this));
        game.installHandlers(server);

        log(`Server listening on port ${port}...`);
        server.listen(port);
    }

    handleNewGamesSubscriber(conn: sockjs.Connection) {
        conn.write(JSON.stringify(this.getGames()));
        conn.on("data", (message: string) => {
            this.newGame();
            const response = JSON.stringify(this.getGames());
            conn.write(response);
        });
        conn.on("close", function () {});
    }

    handleNewGameSubscriber(conn: sockjs.Connection) {
        conn.on("data", (data: string) => {
            const message = JSON.parse(data);
            if (this.games.has(message.id)) {
                conn.write(
                    JSON.stringify(this.games.get(message.id)?.getState())
                );
            }
        });
        conn.on("close", function () {});
    }

    newGame() {
        const game = new Game(generateId());
        this.games.set(game.id, game);
        return game.getState();
    }

    getGames() {
        const result: Array<any> = [];
        this.games.forEach(({ id }: Game, key: number) => {
            const game = {
                id
            };
            result.push(game);
        });
        return result;
    }
}

const log = (str: any) => {
    console.log(str);
    console.log("");
};

const port = parseInt(process.env.PORT || "9999");
log("Running server");
new SockJSGameServer().listen(port);
