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

            // Causes wrong player exception
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
            server.startGame();
            const subSpy = jasmine.createSpy("subscription");

            server.subscribe(subSpy);
            server.action(id, {
                kind: "Pass",
                playerId: 1
            });

            expect(subSpy).toHaveBeenCalled();
            expect(subSpy.calls.first().args[0]["currentPlayer"]).toEqual(2);
        });
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
