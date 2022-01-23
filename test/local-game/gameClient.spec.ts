import GameClient from "../../src/local-game/gameClient";
import LocalGameServer from "../../src/local-game/localGameServer";

describe('Game Client', () => {
    it("Subscribes an AI to game for an AI Player", () => {
        const server = new LocalGameServer();
        jest.spyOn(server, "subscribe");
        const gameClient = new GameClient(server);
        gameClient.newGame();
        gameClient.registerPlayer({name: "P1", isAI: true});

        expect(server.subscribe).toHaveBeenCalled();
    })
});