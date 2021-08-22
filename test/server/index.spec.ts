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
        it("A subscriber gets updated gameState after a successful action", () => {
            const { id } = server.newGame();
            ["p1", "p2", "p3", "p4"].forEach(p => server.registerPlayer(p));
            server.startGame();
            const subSpy = jasmine.createSpy("subscription");

            server.subscribe(subSpy);
            server.action(id, {
                kind: "Pass",
                playerId: 1
            });

            expect(subSpy).toHaveBeenCalled();
            expect(subSpy.calls.first().args[0]["currentPlayerId"]).toEqual(2);
        });

        it("A subscriber gets updated gameState after the game is started", () => {
            server.newGame();
            ["p1", "p2", "p3", "p4"].forEach(p => server.registerPlayer(p));
            const subSpy = jasmine.createSpy("subscription");
            server.subscribe(subSpy);
            
            server.startGame();
            
            expect(subSpy).toHaveBeenCalled();
            expect(subSpy.calls.first().args[0]["status"]).toEqual(GameStatus.STARTED);
        });

        it("Multiple subscribers can subscribe", () => {
            server.newGame();
            ["p1", "p2", "p3", "p4"].forEach(p => server.registerPlayer(p));
            const subSpy = jasmine.createSpy("subscription");
            const subSpy2 = jasmine.createSpy("subscription");
            server.subscribe(subSpy);
            server.subscribe(subSpy2);
            
            server.startGame();
            expect(subSpy).toHaveBeenCalled();
            expect(subSpy2).toHaveBeenCalled();
        })
    });

    it("Returns the new player ID when registering a player", () => {
        const game = server.newGame();
        expect(server.registerPlayer("Player 1")).toEqual(1);
        expect(server.registerPlayer("Another one")).toEqual(2);
    })
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
