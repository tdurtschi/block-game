import server from "../../src/server";
import GameStatus from "../../src/server/GameStatus";

describe("server", () => {
    let subject: server;

    beforeEach(() => {
        subject = new server();
    })

    it("Creates a game", () => {
        const game = subject.newGame();
        expect(game.id).toBeDefined();
        expect(game.status).toBe(GameStatus.CREATED);
    });

    it("Retrieves an existing game", () => {
        const game = subject.newGame();
        expect(subject.getGame(game.id)).toEqual(game);
    });
});