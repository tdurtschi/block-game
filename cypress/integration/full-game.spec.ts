import Action from "../../src/shared/types/Actions";
import { testGameFixture } from "../../test/testGameFixture";
import {
    clickPlayersPieceAtPosition,
    rotateCounterclockwise,
    pass
} from "../util";
import { clickBoardAtPosition } from "./online.spec";

// Takes too long!
xit("Plays a full game", () => {
    cy.visit("/");
    cy.contains("Block Game");
    cy.get("[data-new-game]").click();
    cy.get("[data-confirm-action]").click();
    const buildPieceMap = () => {
        const piecePositions: Map<number, number> = new Map();
        new Array(21).fill(0).forEach((_, idx) => {
            piecePositions.set(idx, idx);
        });
        return piecePositions;
    };
    const gamePiecePositions = [
        buildPieceMap(),
        buildPieceMap(),
        buildPieceMap(),
        buildPieceMap()
    ];

    testGameFixture.forEach((action: Action) => {
        if (action.kind === "GamePlay") {
            const pieceMap = gamePiecePositions[action.playerId - 1];
            const piecePosition = pieceMap.get(action.piece);
            clickPlayersPieceAtPosition(piecePosition);
            if (action.rotate) {
                for (var i = 0; i < action.rotate; i++) {
                    rotateCounterclockwise();
                    cy.wait(300);
                }
            }
            if (action.flip === true) {
                cy.get("[data-game-board]").trigger("mousedown", {
                    button: 2
                });
            }

            clickBoardAtPosition(action.location);
            cy.get("[data-confirm-action]").click();

            for (var i = action.piece; i < 21; i++) {
                pieceMap.set(i, pieceMap.get(i) - 1);
            }
        } else {
            pass();
        }
    });

    cy.get("[data-game-over]");
});
