describe("Online game", () => {
    before(() => {
        cy.visit("/");
        cy.contains("Block Game");
    });

    it("Creates and views online games.", () => {
        cy.get("[data-online-game]").click();
        cy.get("[data-games-list] tbody").then((gamesList: JQuery<HTMLElement>) => {
            const games = gamesList.children("tr");
            const numOfExistingGames = games.length;

            cy.get("[data-new-online-game]").click();

            cy.get("[data-games-list] tr").should(
                "have.length",
                numOfExistingGames + 1
            );
        });
    });

    it("joins an online game.", () => {
        cy.get("[data-join-game]").click();
        cy.get("[data-start-game]").click();
        cy.get("[data-game-board]");
    });
});
