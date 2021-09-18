import GameClient from "../../src/game-client";
import GameServer from "../../src/server-local";

describe('Game Client', () => {
    it("Subscribes an AI to game for an AI Player", () => {
        const server = new GameServer();
        jest.spyOn(server, "subscribe");
        const gameClient = new GameClient(server);
        gameClient.newGame();
        gameClient.registerPlayer({name: "P1", isAI: true});

        expect(server.subscribe).toHaveBeenCalled();
    })
});