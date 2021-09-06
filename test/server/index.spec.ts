import GameServer from "../../src/server";
import { GamePlayAction } from "../../src/shared/types/Actions";
import GameStatus from "../../src/shared/types/GameStatus";
import PlayerId from "../../src/shared/types/PlayerId";

describe("server", () => {
    let server: GameServer;

    beforeEach(() => {
        server = new GameServer();
    });

    it("Creates a game", () => {
        const game = server.newGame();
        expect(game.id).toBeDefined();
        expect(game.status).toBe(GameStatus.CREATED);
    });

    it("Gives each game a unique ID", () => {
        const game = server.newGame();
        const game2 = server.newGame();
        expect(game.id).not.toEqual(game2.id);
    });

    describe("Game Exceptions", () => {
        it("Converts a game exception into an error response", () => {
            const game = server.newGame();

            // Causes game not started exception
            const result = server.action(
                game.id,
                gameMove(2, 0, { x: 0, y: 0 })
            );

            expect(result.errorMessage).toBeDefined();
        });
    });

    describe("Subscribers", () => {
        it("A subscriber gets updated gameState after a successful action", async () => {
            const { id } = server.newGame();
            ["p1", "p2", "p3", "p4"].forEach((p) =>
                server.registerPlayer(id, p)
            );
            server.startGame(id);
            const subSpy = jasmine.createSpy("subscription");

            server.subscribe(id, subSpy);
            server.action(id, {
                kind: "Pass",
                playerId: 1
            });

            await flushAsync();
            expect(subSpy).toHaveBeenCalled();
            expect(subSpy.calls.first().args[0]["currentPlayerId"]).toEqual(2);
        });

        it("A subscriber gets updated gameState after the game is started", async () => {
            const { id } = server.newGame();
            ["p1", "p2", "p3", "p4"].forEach((p) =>
                server.registerPlayer(id, p)
            );
            const subSpy = jasmine.createSpy("subscription");
            server.subscribe(id, subSpy);

            server.startGame(id);

            await flushAsync();
            expect(subSpy).toHaveBeenCalled();
            expect(subSpy.calls.first().args[0]["status"]).toEqual(
                GameStatus.STARTED
            );
        });

        it("Multiple subscribers can subscribe", async () => {
            const { id } = server.newGame();
            ["p1", "p2", "p3", "p4"].forEach((p) =>
                server.registerPlayer(id, p)
            );
            const subSpy = jasmine.createSpy("subscription");
            const subSpy2 = jasmine.createSpy("subscription");
            server.subscribe(id, subSpy);
            server.subscribe(id, subSpy2);

            server.startGame(id);

            await flushAsync();
            expect(subSpy).toHaveBeenCalled();
            expect(subSpy2).toHaveBeenCalled();
        });

        it("Only notifies subscribers about the game they're subscribed to", async () => {
            const id1 = server.newGame().id;
            const id2 = server.newGame().id;
            const subSpy = jasmine.createSpy("subscription");
            const subSpy2 = jasmine.createSpy("subscription");
            server.subscribe(id1, subSpy);
            server.subscribe(id2, subSpy2);
            server.registerPlayer(id1, "Player 1");

            await flushAsync();
            expect(subSpy).toHaveBeenCalled();
            expect(subSpy2).not.toHaveBeenCalled();
        });
    });

    it("Returns the new player ID when registering a player", () => {
        const { id } = server.newGame();
        expect(server.registerPlayer(id, "Player 1")).toEqual(1);
        expect(server.registerPlayer(id, "Another one")).toEqual(2);
    });
});

function gameMove(
    playerId: PlayerId,
    piece: number,
    location: { x: number; y: number },
    rotate: 0 | 1 | 2 | 3 = 0
): GamePlayAction {
    return {
        kind: "GamePlay",
        playerId,
        piece,
        location,
        rotate,
        flip: false
    };
}

const flushAsync = async () => {
    return new Promise((resolve) => {
        setTimeout(resolve, 0);
    });
};
