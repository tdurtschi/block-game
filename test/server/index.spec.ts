import server from "../../src/server";
import GameStatus from "../../src/types/GameStatus";

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

    describe("Subscribers", () => {
        it("A subscriber gets updated gameState after a successful action", () => {
            const { id } = subject.newGame();
            const subSpy = jasmine.createSpy("subscription");

            subject.subscribe(subSpy);
            subject.action(id, {
                kind: "Pass",
                playerId: 1
            });

            expect(subSpy).toHaveBeenCalled();
            expect(subSpy.calls.first().args[0]["currentPlayer"]).toEqual(2);
        })
    });
});