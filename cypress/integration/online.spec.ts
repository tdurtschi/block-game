describe("Online game", () => {
    beforeEach(() => {
        cy.visit("/");
        cy.contains("Block Game");
    });

    it("Creates an online game.", () => {
        cy.get("[data-online-game]").click();
        cy.get("[data-new-online-game]").click();
        cy.get("[data-join-game]").click();
        cy.get("[data-start-game]").click();
        cy.get("[data-game-board]");
    });

    // it("Joins an online game.", () => {
    //     cy.get("[data-online-game]").click();
    // });
});

export function clickBoardAtPosition(position: { x: number; y: number }) {
    const { x, y } = position;
    cy.get(
        `[data-game-board] [data-coord-x='${x}'][data-coord-y='${y}']`
    ).click();
}
