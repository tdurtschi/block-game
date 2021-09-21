describe("Online game", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("Creates an online game.", () => {
        cy.contains("Block Game");
        cy.get("[data-new-online-game]").click();
        cy.get("[data-confirm-action]").click();
    });

    it("Plays a full game", () => {
        
    });
});
