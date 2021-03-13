import { GamePlayAction } from "../src/shared/types/Actions";
import Game from "../src/server/Game";
import GameStatus from "../src/shared/types/GameStatus";
import PlayerId from "../src/server/PlayerId";

describe("Game", () => {
    it("Has 4 players", () => {
        const game = new Game(0);
        expect(game.players.length).toBe(4);
    });

    describe("Initial Gameplay", () => {
        it("Game isn't over", () => {
            const game = new Game(0);
            expect(game.status).toBe(GameStatus.CREATED);
        });

        it("Player 1 can make a move", () => {
            const game = new Game(0);
            game.action(gameMove(1, 0, { x: 0, y: 0 }));
        });

        it("Player 2 cannot move", () => {
            const game = new Game(0);
            expectError(() => {
                game.action(gameMove(2, 0, { x: 0, y: 0 }))
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
            expect(game.status).toBe(GameStatus.OVER);
        });

        it("Skips a player who's already passed", () => {
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
            game.action(gameMove(4, 0, { x: 0, y: 0 }))
            expect(game.getState().currentPlayer).toEqual(4);
        });

        it("Two players can't play in the same spot", () => {
            const game = new Game(0);
            game.action(gameMove(1, 0, { x: 0, y: 0 }))
            expectError(() => {
                game.action(gameMove(2, 0, { x: 0, y: 0 }))
            });
        });

        it("A player's piece is removed from inventory after playing it", () => {
            const game = new Game(0);
            const pieceToPlay = 0;
            game.action(gameMove(1, pieceToPlay, { x: 0, y: 0 }))

            const state = game.getState();
            expect(state.players[0].playerPieces.find(piece => piece.id == pieceToPlay)).toBeFalsy();
        });
    });

    it("Regression Test: Player 2 can move after making an invalid attempt", () => {
        const game = new Game(0);
        game.action(gameMove(1, 0, { x: 0, y: 0 }));

        try {
            game.action(gameMove(2, 0, { x: 0, y: 0 }));
        } catch (error) { }

        game.action(gameMove(2, 0, { x: 2, y: 0 }));
    });
});

function expectError(fn: Function): void {
    try {
        fn();
        fail("Expected exception but was none");
    } catch {
    }
}

function gameMove(playerId: PlayerId, piece: number, location: { x: number, y: number }, rotate: 0 | 1 | 2 | 3 = 0): GamePlayAction {
    return {
        kind: "GamePlay",
        playerId,
        piece,
        location,
        rotate,
        flip: false
    }
}