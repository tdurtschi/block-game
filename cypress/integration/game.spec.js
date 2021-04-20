describe("Block Game", () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/');
    });

    it("Displays the Header text and has a button to start the game.", () => {
        cy.contains("Block Game");
        cy.get("[data-new-game]")
    });

    describe("Gameplay", () => {
        beforeEach(() => {
            cy.get("[data-new-game]").click();
        });

        it("Shows a gameboard and all game pieces", () => {
            cy.get("[data-new-game]").should("not.exist");
            cy.get("[data-game-board]");
            cy.get("[data-game-board] .board-cell");
            cy.get("[data-player-pieces]");
            cy.get(".player-1-color.game-piece")
        });

        describe("End of the game", () => {
            beforeEach(() => {
                cy.contains("Player 1");
                cy.get("[data-player-pass-button]").click();
                cy.contains("Player 2");
                cy.get("[data-player-pass-button]").click();
                cy.contains("Player 3");
                cy.get("[data-player-pass-button]").click();
                cy.contains("Player 4");
                cy.get("[data-player-pass-button]").click();
            })

            it("If everyone passes, the game is over", () => {
                cy.get("[data-game-over]");
            });

            it('Shows each player\'s score', () => {
                cy.get(".player-1-score").contains("0");
                cy.get(".player-2-score").contains("0");
                cy.get(".player-3-score").contains("0");
                cy.get(".player-4-score").contains("0");
                cy.get("[data-game-over]").contains("Tie game");
            });

            it("Allows a player to start a new game", () => {
                cy.get("[data-new-game]").click();
                cy.contains("Player 1");
            })
        })

        describe("Passing", () => {
            it("Clears a staged piece from the game board and the active piece", () => {
                cy.get("[data-game-piece]").eq(0).click();
                cy.get("[data-game-board] [data-coord-x='0'][data-coord-y='0']").click();
                cy.get("[data-player-pass-button]").click();
                cy.get("[data-game-board] [data-coord-x='0'][data-coord-y='0'].player-1-color").should("not.exist");
                cy.get("[data-game-board] [data-coord-x='0'][data-coord-y='0'].player-2-color").should("not.exist");
                cy.get('[data-active-piece]').should("not.exist");
            });
        });

        describe("Playing Pieces", () => {
            it("Can play a piece by clicking it, clicking the game board, and confirming", () => {
                cy.get("[data-game-piece]").eq(0).click();
                cy.get("[data-game-board] [data-coord-x='0'][data-coord-y='0']").click();
                cy.get("[data-confirm-action]").click();

                verifyBoardArea(0, 0, [
                    [1, 0],
                    [1, 0],
                    [1, 1],
                    [0, 1],
                ]);
            })

            it("Can cancel a staged piece by clicking the cancel button", () => {
                cy.get("[data-game-piece]").eq(0).click();
                cy.get("[data-game-board] [data-coord-x='0'][data-coord-y='0']").click();
                cy.get("[data-cancel-action]").click();
                verifyBoardArea(0, 0, [
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                ]);
            })

            it("Can rotate a piece with the mouse wheel", () => {
                cy.get("[data-game-piece]").eq(0).click();
                cy.get("[data-game-board]").trigger("wheel", { deltaY: -4 });
                cy.get("[data-game-board] [data-coord-x='16'][data-coord-y='0']").click();
                cy.get("[data-confirm-action]").click();

                verifyBoardArea(16, 0, [
                    [0, 0, 1, 1],
                    [1, 1, 1, 0]
                ]);
            })

            it("Can flip a piece with a right click", () => {
                cy.get("[data-game-piece]").eq(0).click();
                cy.get("[data-game-board]").trigger("mousedown", { button: 2 });
                cy.get("[data-game-board] [data-coord-x='18'][data-coord-y='0']").click();
                cy.get("[data-confirm-action]").click();

                verifyBoardArea(18, 0, [
                    [0, 1],
                    [0, 1],
                    [1, 1],
                    [1, 0],
                ]);
            })

            it("Can pick up a piece from the board to move it", () => {
                cy.get("[data-game-piece]").eq(0).click();
                cy.get("[data-game-board] [data-coord-x='0'][data-coord-y='0']").click();
                cy.get("[data-game-board] [data-coord-x='0'][data-coord-y='0']").click();
                cy.get("[data-game-board] [data-coord-x='18'][data-coord-y='16']").click();
                cy.get("[data-confirm-action]").click();

                verifyBoardArea(18, 16, [
                    [1, 0],
                    [1, 0],
                    [1, 1],
                    [0, 1],
                ]);
            })
        });
    });
});

function verifyBoardArea(xCoord, yCoord, data) {
    data.forEach((row, yIdx) => {
        row.forEach((cell, xIdx) => {
            const playerId = cell;
            let selector = `[data-game-board] [data-coord-x='${xCoord + xIdx}'][data-coord-y='${yCoord + yIdx}']`;
            if (playerId > 0) {
                selector = selector + `.player-${playerId}-color`;
            } else {
                [1,2,3,4].forEach(pId => cy.get(selector + `.player-${pId}-color`).should('not.exist'));
            }
            cy.get(selector);
        })
    })
}