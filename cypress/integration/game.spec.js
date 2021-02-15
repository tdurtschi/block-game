describe("Block Game", () => {
    beforeEach(() => {
        cy.visit('http://localhost:5000/');
    });

    it("Displays the name of the game and new game button.", () => {
        cy.contains("Block Game");
    });

    describe("Starting a new game", () => {
        beforeEach(() => {
            cy.get("[data-new-game]").click();
        });

        it("changes the message", () => {
            cy.contains("Hello!");
        })
    });
});