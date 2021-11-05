import { clickPlayersFirstPiece, verifyBoardArea } from "../util";

describe("Online game", () => {
    let gameToJoinIdx: number;
    before(() => {
        cy.visit("/");
        cy.contains("Block Game");
    });

    it("Creates and views online games.", () => {
        cy.get("[data-online-game]").click();
        cy.get("[data-games-list] tbody").then(
            (gamesList: JQuery<HTMLElement>) => {
                const games = gamesList.children("tr");
                const numOfExistingGames = games.length;

                cy.get("[data-new-online-game]").click();

                cy.get("[data-games-list] tbody tr").should(
                    "have.length",
                    numOfExistingGames + 1
                );

                gameToJoinIdx = numOfExistingGames;
            }
        );
    });

    it("Joins the created online game.", () => {
        cy.get("[data-games-list] tbody tr").eq(gameToJoinIdx).click();
        cy.get("[data-games-list] tbody tr").eq(gameToJoinIdx).contains("0/4");
        cy.get("[data-games-list] tbody tr").eq(gameToJoinIdx).should("have.class", "selected");
        cy.get("[data-player-name]").type("Hoector");
        cy.get("[data-join-game]").click();
        cy.get("[data-games-list] tbody tr").eq(gameToJoinIdx).contains("1/4");

        cy.contains("3 AI Players").should("exist");
        cy.get("[data-start-game]").click();

        cy.get("[data-games-list]").should("not.exist");
        cy.get("[data-game-board]").should("exist");
    });

    it("Plays the online game.", () => {
        clickPlayersFirstPiece();
        cy.get(
            "[data-game-board] [data-coord-x='0'][data-coord-y='0']"
        ).click();
        cy.get("[data-confirm-action]").click();

        verifyBoardArea(0, 0, [
            [1, 0],
            [1, 0],
            [1, 1],
            [0, 1]
        ]);
    })
});
