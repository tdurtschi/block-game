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
export function verifyBoardArea(xCoord, yCoord, expectedContents) {
    expectedContents.forEach((row, yIdx) => {
        row.forEach((cell, xIdx) => {
            const playerId = cell;
            let selector =
                `[data-game-board] ` +
                `[data-coord-x='${xCoord + xIdx}']` +
                `[data-coord-y='${yCoord + yIdx}']`;
            if (playerId > 0) {
                selector = selector + `.player-${playerId}-color`;
            } else {
                [1, 2, 3, 4].forEach((pId) =>
                    cy
                        .get(selector + `.player-${pId}-color`)
                        .should("not.exist")
                );
            }
            cy.get(selector);
        });
    });
}

export function clickPlayersFirstPiece() {
    clickPlayersPieceAtPosition(0);
}
