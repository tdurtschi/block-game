describe("Block Game", () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/');
    });

    it("Displays the name of the game", () => {
        cy.contains("Block Game");
    });

    describe("Starting a new game", () => {
        beforeEach(() => {
            cy.get("[data-new-game]").click();
        });

        it("Shows a gameboard and all game pieces", () => {
            cy.get("[data-game-board]");
            cy.get("[data-player-pieces]");
            cy.get(".player-1-color .game-piece")
            cy.get("[data-new-game]").should("be.disabled");
        });
    });
});