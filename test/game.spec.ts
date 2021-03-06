import Game from "../src/server/Game";

describe("Game", () => {
    it("Has 4 players", () => {
        const game = new Game(0);
        expect(game.players.length).toBe(4);
    });

    describe("Initial Gameplay", () => {
        it("Game isn't over", () => {
            const game = new Game(0);
            expect(game.isOver).toBeFalsy();
        });

        it("Player 1 can make a move", () => {
            const game = new Game(0);
            game.action(
                {
                    kind: "GamePlay",
                    playerId: 1,
                    piece: 0,
                    location: { x: 0, y: 0 }
                }
            );
        })

        it("Player 2 cannot move", () => {
            const game = new Game(0);
            expectError(() => {
                game.action(
                    {
                        kind: "GamePlay",
                        playerId: 2,
                        piece: 0,
                        location: { x: 0, y: 0 }
                    }
                )
            });
        });
    });

    describe("Gameplay", () => {
        it("Play ends when all players have passed", () => {
            const game = new Game(0);
            game.action({
                playerId: 1,
                kind: "Pass"
            })
            game.action({
                playerId: 2,
                kind: "Pass"
            })
            game.action({
                playerId: 3,
                kind: "Pass"
            })
            game.action({
                playerId: 4,
                kind: "Pass"
            })
            expect(game.isOver).toBe(true);
        });
    });
});

function expectError(fn: Function): void {
    try {
        fn();
        fail("Expected exception but was none");
    } catch {
    }
}