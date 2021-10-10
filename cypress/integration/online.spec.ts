describe("Online game", () => {
    beforeEach(() => {
        cy.visit("/");
        cy.contains("Block Game");
    });

    it("Creates and joins an online game.", () => {
        cy.get("[data-online-game]").click();
        cy.get("[data-new-online-game]").click();
        cy.get("[data-join-game]").click();
        cy.get("[data-start-game]").click();
        cy.get("[data-game-board]");
    });
});