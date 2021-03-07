describe("Block Game", () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/');
    });

    it("Displays the name of the game", () => {
        cy.contains("Block Game");
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
    });
});