import { GamePlayAction } from "../../src/shared/types/Actions";
import Game from "../../src/server/Game";
import GameStatus from "../../src/shared/types/GameStatus";
import PlayerId from "../../src/shared/types/PlayerId";
import GamePiece from "../../src/shared/types/GamePiece";
import { fixture_playerUsesAllPiecesToEndGame } from "../testGameFixture";

describe("Game", () => {
    xit("Has 4 players", () => {
        const game = new Game(0);
        expect(game.players.length).toBe(4);
    });

    describe("Initial Gameplay", () => {
        let game: Game;
        beforeEach(() => {
            game = new Game(0);
        });

        it("Game isn't started", () => {
            expect(game.status).toBe(GameStatus.CREATED);
        });

        it("Player 1 cannot move", () => {
            expectError(() => {
                game.action(gameMove(1, 0, { x: 0, y: 0 }));
            });
        });

        describe("Registering Players", () => {
            it("Can't start game without registering 4 players", () => {
                expectError(() => {
                    game.start();
                });
            });

            it("Can't register more than 4 players", () => {
                ["p1", "p2", "p3", "p4"].forEach(p => game.registerPlayer(p));

                expectError(() => {
                    game.registerPlayer("p5");
                })
            });

            it("Keeps track of registered players", () => {
                game.registerPlayer("Steve");
                expect(game.getState().players[0].name).toEqual("Steve");
            });

            it("Can start game after registering 4 players", () => {
                ["p1", "p2", "p3", "p4"].forEach(p => game.registerPlayer(p));
                game.start();

                expect(game.status).toBe(GameStatus.STARTED);
            });
        });

        describe("After starting the game", () => {
            beforeEach(() => {
                ["p1", "p2", "p3", "p4"].forEach(p => game.registerPlayer(p));
                game.start();
            });

            it("Game is started", () => {
                expect(game.status).toBe(GameStatus.STARTED);
            })

            it("Player 1 can make a move", () => {
                game.action(gameMove(1, 0, { x: 0, y: 0 }));
            });
    
            it("Player 2 cannot move", () => {
                expectError(() => {
                    game.action(gameMove(2, 0, { x: 0, y: 0 }));
                });
            });
        })
    });

    describe("Gameplay", () => {
        let game: Game;
        beforeEach(() => {
            game = new Game(0);
            ["p1", "p2", "p3", "p4"].forEach(p => game.registerPlayer(p));
            game.start();
        })

        it("Play ends when all players have passed", () => {
            game.action({
                playerId: 1,
                kind: "Pass"
            });
            game.action({
                playerId: 2,
                kind: "Pass"
            });
            game.action({
                playerId: 3,
                kind: "Pass"
            });
            game.action({
                playerId: 4,
                kind: "Pass"
            });
            expect(game.status).toBe(GameStatus.OVER);
        });

        it("Play ends when all players have passed or have no pieces left", () => {
            fixture_playerUsesAllPiecesToEndGame.forEach((action) => {
                game.action(action);
            });
            expect(game.status).toBe(GameStatus.OVER);
        });

        it("Skips a player who's already passed", () => {
            game.action({
                playerId: 1,
                kind: "Pass"
            });
            game.action({
                playerId: 2,
                kind: "Pass"
            });
            game.action({
                playerId: 3,
                kind: "Pass"
            });
            game.action(gameMove(4, 0, { x: 0, y: 0 }));
            expect(game.getState().currentPlayer).toEqual(4);
        });

        it("A player's piece is removed from inventory after playing it", () => {
            const pieceToPlay = 0;
            game.action(gameMove(1, pieceToPlay, { x: 0, y: 0 }));

            const state = game.getState();
            expect(
                state.players[0].playerPieces.find(
                    (piece: GamePiece) => piece.id == pieceToPlay
                )
            ).toBeFalsy();
        });


        describe("Move validation logic", () => {
            it("Two players can't play in the same spot", () => {
                game.action(gameMove(1, 0, { x: 0, y: 0 }));
                expectError(() => {
                    game.action(gameMove(2, 0, { x: 0, y: 0 }));
                });
            });

            it("Piece cannot extend past the edges of the board", () => {
                expectError(() => {
                    game.action(gameMove(1, 0, { x: 19, y: 0 }));
                });

                expectError(() => {
                    game.action(gameMove(1, 0, { x: 0, y: 19 }));
                });
            });

            describe("First piece in the corner", () => {
                describe("Happy path, everyone claims a corner", () => {
                    it("Lets all four players play in a corner", () => {
                        game.action(gameMove(1, 20, { x: 0, y: 0 }));
                        game.action(gameMove(2, 20, { x: 19, y: 0 }));
                        game.action(gameMove(3, 20, { x: 0, y: 19 }));
                        game.action(gameMove(4, 20, { x: 19, y: 19 }));
                    });

                    it("Allows next play to be outside of corner", () => {
                        game.action(gameMove(1, 20, { x: 0, y: 0 }));
                        game.action(gameMove(2, 20, { x: 19, y: 0 }));
                        game.action(gameMove(3, 20, { x: 0, y: 19 }));
                        game.action(gameMove(4, 20, { x: 19, y: 19 }));
                        game.action(gameMove(1, 0, { x: 1, y: 1 }));
                    });
                });

                it("Throw error if first play not in the corner", () => {
                    expectError(() => {
                        game.action(gameMove(1, 20, { x: 1, y: 0 }));
                    });
                });
            });

            describe("Piece touches a previously played piece only diagonally", () => {
                beforeEach(() => {
                    game.action({
                        playerId: 1,
                        kind: "Pass"
                    });
                    game.action({
                        playerId: 2,
                        kind: "Pass"
                    });
                    game.action({
                        playerId: 3,
                        kind: "Pass"
                    });
                });

                it("Happy path - piece played connecting diagonally", () => {
                    game.action(gameMove(4, 0, { x: 0, y: 0 }));
                    game.action(gameMove(4, 1, { x: 2, y: 0 }));
                });

                it("Throw error if play doesn't touch another piece", () => {
                    game.action(gameMove(4, 0, { x: 0, y: 0 }));

                    expectError(() => {
                        game.action(gameMove(4, 1, { x: 3, y: 0 }));
                    });
                });

                it("Throw error if play touches another adjacently", () => {
                    game.action(gameMove(4, 0, { x: 0, y: 0 }));

                    expectError(() => {
                        game.action(gameMove(4, 1, { x: 1, y: 0 }));
                    });
                });
            });
        });
        
        it("Regression Test: Player 2 can move after making an invalid attempt", () => {
            game.action(gameMove(1, 0, { x: 0, y: 0 }));

            try {
                game.action(gameMove(2, 0, { x: 0, y: 0 }));
            } catch (error) {}

            game.action(gameMove(2, 20, { x: 19, y: 0 }));
        });
    });
});

function expectError(fn: Function): void {
    try {
        fn();
        fail("Expected exception but was none");
    } catch {}
}

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
