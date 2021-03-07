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
            cy.get("[data-new-game]").should("be.disabled");
            cy.get("[data-game-board]");
            cy.get("[data-game-board] .board-cell");
            cy.get("[data-player-pieces]");
            cy.get(".player-1-color .game-piece")
        });

        it("Completes a game where everyone passes", () => {
            cy.contains("Player 1");
            cy.get("[data-player-pass-button]").click();
            cy.contains("Player 2");
            cy.get("[data-player-pass-button]").click();
            cy.contains("Player 3");
            cy.get("[data-player-pass-button]").click();
            cy.contains("Player 4");
            cy.get("[data-player-pass-button]").click();
            cy.get("[data-game-over]");
        });

        describe("Playing Pieces", () => {
            it("Can play a piece by clicking it and clicking the game board", () => {
                cy.get("[data-game-piece]").eq(0).click(); // Piece 0 looks like ` ` | .
                cy.get("[data-game-board] [data-coord-x='0'][data-coord-y='0']").click();
                cy.get("[data-confirm-action]").click();

                cy.get("[data-game-board] [data-coord-x='0'][data-coord-y='0'].player-1-color");
            })
        })
    });
});