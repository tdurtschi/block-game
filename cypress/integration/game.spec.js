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

            it("Completes a game where everyone passes", () => {
                cy.get("[data-game-over]");
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
            it("Can play a piece by clicking it and clicking the game board", () => {
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

            it("Can rotate a piece with the mouse wheel", () => {
                cy.get("[data-game-piece]").eq(0).click();
                cy.get("[data-game-board]").trigger("wheel", { deltaY: -4 });
                cy.get("[data-game-board] [data-coord-x='0'][data-coord-y='0']").click();
                cy.get("[data-confirm-action]").click();

                verifyBoardArea(0, 0, [
                    [0, 0, 1, 1],
                    [1, 1, 1, 0]
                ]);
            })

            it("Can flip a piece with a right click", () => {
                cy.get("[data-game-piece]").eq(0).click();
                cy.get("[data-game-board]").trigger("mousedown", { button: 2 });
                cy.get("[data-game-board] [data-coord-x='0'][data-coord-y='0']").click();
                cy.get("[data-confirm-action]").click();

                verifyBoardArea(0, 0, [
                    [0, 1],
                    [0, 1],
                    [1, 1],
                    [1, 0],
                ]);
            })
        });
    });
});

function verifyBoardArea(xCoord, yCoord, data) {
    data.forEach((row, yIdx) => {
        row.forEach((cell, xIdx) => {
            let selector = `[data-game-board] [data-coord-x='${xCoord + xIdx}'][data-coord-y='${yCoord + yIdx}']`;
            if (cell > 0) {
                selector = selector + `.player-${cell}-color`;
            }
            cy.get(selector);
        })
    })
}