import * as http from "http";
import * as sockjs from "sockjs";
import Game from "../shared/Game";
import { AIPlayer } from "../ai-player/ai-player";
import { generateId } from "../shared/idGenerator";
import { GameMessage } from "./game-message";
import GameState from "../shared/types/GameState";
import Action from "../shared/types/Actions";
import { SERVER__AI_PLAYER_DELAY } from "../shared/constants";
import GameStatus from "../shared/types/GameStatus";

interface Subscriber {
    onUpdate: (gameState: GameState) => any;
    onCloseConnection?: () => any;
}

class SockJSGameServer {
    private games: Map<number, Game> = new Map();
    private gameSubscribers: Map<number, Subscriber[]> = new Map();
    private gameListSubscribers: sockjs.Connection[] = [];

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
        this.gameListSubscribers.push(conn);
        conn.write(JSON.stringify(this.getGames()));
        conn.on("data", (message: string) => {
            this.newGame();
            this.sendUpdateToGamesSubscribers();
        });
        conn.on("close", function () {});
    }

    handleNewGameSubscriber(conn: sockjs.Connection) {
        conn.on("data", (data: string) => {
            const message: GameMessage = JSON.parse(data);
            console.info("Got message: ", message);

            try {
                this.handleGameMessage(message, conn);
            } catch (error) {
                console.log("caught error applying action to game");
                console.log(error);
            }
        });
        conn.on("close", function () {});
    }

    newGame() {
        const game = new Game(generateId());
        this.games.set(game.id, game);
        this.gameSubscribers.set(game.id, []);
        return game.getState();
    }

    getGames() {
        const result: Array<any> = [];
        this.games.forEach(({ id, players }: Game, key: number) => {
            const game = {
                id,
                players: players.length
            };
            result.push(game);
        });
        return result;
    }

    handleGameMessage(message: GameMessage, conn: sockjs.Connection) {
        const game = this.games.get(message.id);
        if (game) {
            if (message.kind === "SUBSCRIBE") {
                const subscribers = this.gameSubscribers.get(message.id)!;
                const newSubscriber: Subscriber = {
                    onUpdate: (gameState) => {
                        conn.write(JSON.stringify(gameState));
                    },
                    onCloseConnection: () => conn.close()
                }
                subscribers.push(newSubscriber);
            } else if (message.kind === "REGISTER") {
                game.registerPlayer(message.playerName);
                this.sendUpdateToGamesSubscribers();
            } else if (message.kind === "START") {
                this.registerAIPlayers(game);
                game.start();
            } else if (message.kind === "ACTION") {
                this.applyGameAction(game, message.action);
            }

            this.sendUpdateToGameSubscribers(game);
        }
    }

    applyGameAction(game: Game, action: Action) {
        game.action(action);
        if(game.status === GameStatus.OVER) {
            this.handleGameOver(game);
        }
    }

    sendUpdateToGameSubscribers(game: Game) {
        const newState: Readonly<GameState> = game.getState()
        const subscribers = this.gameSubscribers.get(game.id)!;
        subscribers.forEach((subscriber) => {
            subscriber.onUpdate(newState)
        });
    }

    sendUpdateToGamesSubscribers() {
        const message = JSON.stringify(this.getGames());
        this.gameListSubscribers.forEach((conn) => conn.write(message));
    }

    registerAIPlayers(game: Game) {
        for(let i = game.players.length; i < 4; i++){
            this.registerAIPlayer(game, i);
        }
    }

    registerAIPlayer(game: Game, playerNumber: number) {
        const playerId = game.registerPlayer(`Player ${playerNumber+1} 🎮`);
        const subscribe = (onUpdate: (gameState: GameState) => any) => {
            const subscribers = this.gameSubscribers.get(game.id)
            subscribers?.push({onUpdate: (gameState: GameState) => setTimeout(() => onUpdate(gameState), SERVER__AI_PLAYER_DELAY)});
        };

        const action = (action: Action) => {
            this.applyGameAction(game, action);
            this.sendUpdateToGameSubscribers(game);
        }

        new AIPlayer({
            subscribe,
            action
        }, playerId);
    }

    handleGameOver(game: Game) {
        setTimeout((() => {
            this.games.delete(game.id);
            this.sendUpdateToGamesSubscribers();
            
            const gameSubs: Subscriber[] = this.gameSubscribers.get(game.id)!;
            gameSubs.forEach((subscriber: Subscriber) => subscriber.onCloseConnection !== undefined && subscriber.onCloseConnection());
            this.gameSubscribers.delete(game.id);
        }).bind(this), 0);
    }
}

const log = (str: any) => {
    console.log(str);
    console.log("");
};

const port = parseInt(process.env.SERVER_PORT || "9999");
log("Running server");
new SockJSGameServer().listen(port);
