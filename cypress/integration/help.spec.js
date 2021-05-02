describe("In-Game Help", () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000/");
        cy.contains("Block Game");
    });

    it("Has a link for help, and can go back to start the game", () => {
        cy.get("a").contains("How To Play").click();
        cy.contains("Rules");
        cy.contains("Ok").click();
        cy.get("[data-new-game]").click();
    });
});
