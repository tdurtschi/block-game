describe("In-Game Help", () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000/");
        cy.contains("Block Game");
    });

    it("Has a link for help", () => {
        cy.get("a").contains("How To Play").click();
    });
});
