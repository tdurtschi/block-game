describe("Block Game", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("Displays the Header text and has a button to start the game.", () => {
        cy.contains("Block Game");
        cy.get("[data-new-game]");
    });

    describe("Registering Players", () => {
        it("Gives players custom names", () => {
            cy.get("[data-new-game]").click();
            cy.get("[data-player-1-name]").clear().type("Shleemies");
            cy.get("[data-player-2-name]").clear().type("Shoney's");
            cy.get("[data-player-3-name]").clear().type("Shelley");
            cy.get("[data-player-4-name]").clear().type("Schwifty");
            cy.get("[data-confirm-action]").click();

            cy.contains("Shleemies");
            pass();
            cy.contains("Shoney's");
            pass();
            cy.contains("Shelley");
            pass();
            cy.contains("Schwifty");
            pass();
        });
    })

    describe("Gameplay", () => {
        beforeEach(() => {
            startNewGame()
        });

        it("Shows a gameboard and all game pieces", () => {
            cy.get("[data-new-game]").should("not.exist");
            cy.get("[data-game-board]");
            cy.get("[data-game-board] .board-cell");
            cy.get("[data-player-pieces]");
            cy.get(".player-1-color.game-piece");
        });

        describe("End of the game", () => {
            beforeEach(() => {
                cy.contains("Player 1");
                pass();
                cy.contains("Player 2");
                pass();
                cy.contains("Player 3");
                pass();
                cy.contains("Player 4");
                pass();
            });

            it("If everyone passes, the game is over", () => {
                cy.get("[data-game-over]");
            });

            it("Shows each player's score", () => {
                cy.get(".player-1-score").contains("0");
                cy.get(".player-2-score").contains("0");
                cy.get(".player-3-score").contains("0");
                cy.get(".player-4-score").contains("0");
                cy.contains("Tie game");
            });

            it("Shows the final game board", () => {
                cy.get("[data-game-board]");
            });

            it("Allows a player to start a new game", () => {
                cy.get("[data-new-game]").click();
                cy.contains("Player 1");
            });
        });

        describe("Passing", () => {
            it("Clears the active piece", () => {
                clickPlayersFirstPiece();
                pass();
                cy.get("[data-active-piece]").should("not.exist");
            });

            it("Can cancel passing and play a piece", () => {
                cy.get("[data-player-pass-button]").click();
                cy.get("[data-cancel-action]").click();

                clickPlayersFirstPiece();
                cy.get(
                    "[data-game-board] [data-coord-x='0'][data-coord-y='0']"
                ).click();
                cy.get("[data-confirm-action]").click();
            })
        });

        describe("Playing Pieces", () => {
            it("Can play a piece by clicking it, clicking the game board, and confirming", () => {
                clickPlayersFirstPiece();
                cy.get(
                    "[data-game-board] [data-coord-x='0'][data-coord-y='0']"
                ).click();
                cy.get("[data-confirm-action]").click();

                verifyBoardArea(0, 0, [
                    [1, 0],
                    [1, 0],
                    [1, 1],
                    [0, 1]
                ]);
            });

            it("Can cancel a staged piece by clicking the cancel button", () => {
                clickPlayersFirstPiece();
                cy.get(
                    "[data-game-board] [data-coord-x='0'][data-coord-y='0']"
                ).click();
                cy.get("[data-cancel-action]").click();
                verifyBoardArea(0, 0, [
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0]
                ]);
            });

            it("Can rotate a piece with the mouse wheel", () => {
                clickPlayersFirstPiece();
                cy.get("[data-game-board]").trigger("wheel", { deltaY: -4 });
                cy.get(
                    "[data-game-board] [data-coord-x='16'][data-coord-y='0']"
                ).click();
                cy.get("[data-confirm-action]").click();

                verifyBoardArea(16, 0, [
                    [0, 0, 1, 1],
                    [1, 1, 1, 0]
                ]);
            });

            it("Can flip a piece with a right click", () => {
                clickPlayersFirstPiece();
                cy.get("[data-game-board]").trigger("mousedown", { button: 2 });
                cy.get(
                    "[data-game-board] [data-coord-x='18'][data-coord-y='0']"
                ).click();
                cy.get("[data-confirm-action]").click();

                verifyBoardArea(18, 0, [
                    [0, 1],
                    [0, 1],
                    [1, 1],
                    [1, 0]
                ]);
            });

            it("Can pick up a piece from the board to move it", () => {
                clickPlayersFirstPiece();
                cy.get(
                    "[data-game-board] [data-coord-x='0'][data-coord-y='0']"
                ).click();
                cy.get(
                    "[data-game-board] [data-coord-x='0'][data-coord-y='0']"
                ).click();
                cy.get(
                    "[data-game-board] [data-coord-x='18'][data-coord-y='16']"
                ).click();
                cy.get("[data-confirm-action]").click();

                verifyBoardArea(18, 16, [
                    [1, 0],
                    [1, 0],
                    [1, 1],
                    [0, 1]
                ]);
            });

            it("A staged piece persists when there's an error with the move", () => {
                clickPlayersFirstPiece();
                cy.get(
                    "[data-game-board] [data-coord-x='1'][data-coord-y='1']"
                ).click();
                cy.get("[data-confirm-action]").click();

                verifyBoardArea(1, 1, [
                    [1, 0],
                    [1, 0],
                    [1, 1],
                    [0, 1]
                ]);
            });

            it("Prevents a piece from being placed so that it's off the edge of the board", () => {
                clickPlayersFirstPiece();

                // Try the right edge
                cy.get(
                    "[data-game-board] [data-coord-x='19'][data-coord-y='0']"
                ).click();
                // Try the bottom Edge
                cy.get(
                    "[data-game-board] [data-coord-x='0'][data-coord-y='19']"
                ).click();

                // Make sure the piece can be played (Clicks twice because of some
                // strange Cypress issue where the click happens in the wrong spot here)
                cy.get(
                    "[data-game-board] [data-coord-x='0'][data-coord-y='0']"
                ).click();
                cy.get(
                    "[data-game-board] [data-coord-x='0'][data-coord-y='0']"
                ).click();
                cy.get("[data-confirm-action]").click();
            });

            it("A player can pick up a piece from any part of the piece and place it in the right position", () => {
                cy.get("[data-game-piece]")
                    .eq(0)
                    .get(".row:nth-child(2) > div")
                    .eq(1)
                    .click();

                cy.get(
                    "[data-game-board] [data-coord-x='1'][data-coord-y='1']"
                ).click();
                cy.get("[data-confirm-action]").click();

                verifyBoardArea(0, 0, [
                    [1, 0],
                    [1, 0],
                    [1, 1],
                    [0, 1]
                ]);
            });

            it("[Regression] The second player doesn't start their turn with the last player's staged piece", () => {
                clickPlayersFirstPiece();
                cy.get(
                    "[data-game-board] [data-coord-x='0'][data-coord-y='0']"
                ).click();
                cy.get("[data-confirm-action]").click();

                cy.get("[data-player-pass-button]");
            });
        });
    });
});

function verifyBoardArea(xCoord, yCoord, expectedContents) {
    expectedContents.forEach((row, yIdx) => {
        row.forEach((cell, xIdx) => {
            const playerId = cell;
            let selector =
                `[data-game-board] ` +
                `[data-coord-x='${xCoord + xIdx}']` +
                `[data-coord-y='${yCoord + yIdx}']`;
            if (playerId > 0) {
                selector = selector + `.player-${playerId}-color`;
            } else {
                [1, 2, 3, 4].forEach((pId) =>
                    cy
                        .get(selector + `.player-${pId}-color`)
                        .should("not.exist")
                );
            }
            cy.get(selector);
        });
    });
}

function clickPlayersFirstPiece() {
    cy.get("[data-game-piece]").eq(0).get(".row > div").eq(0).click();
}

function startNewGame() {
    cy.get("[data-new-game]").click();
    cy.get("[data-confirm-action]").click();
}

function pass() {
    cy.get("[data-player-pass-button]").click();
    cy.get("[data-confirm-action]").click();
}
