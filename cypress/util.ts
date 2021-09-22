export function clickPlayersPieceAtPosition(pos: number) {
    console.log("pos is", pos);
    cy.get("[data-game-piece]")
        .eq(pos)
        .within(() => {
            cy.get(".row > div").eq(0).click();
        });
}

export function pass() {
    cy.get("[data-player-pass-button]").click();
    cy.get("[data-confirm-action]").click();
}

export function rotateCounterclockwise() {
    cy.get("[data-game-board]").trigger("wheel", { deltaY: -4 });
}
