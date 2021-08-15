import React = require("react");
import ReactDOM = require("react-dom");
import { act } from "react-dom/test-utils";
import GamePiece, { GamePiecesData } from "../../../src/shared/types/GamePiece";
import GamePieces from "../../../src/ui/game/gamePieces";

let container: HTMLDivElement;

// for more info https://reactjs.org/docs/test-utils.html

beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    document.body.removeChild(container!);
});

describe("Game Pieces", () => {
    it("Shows one piece for each input", () => {
        const gamePieces: GamePiece[] = [
            {
                playerId: 1,
                id: 0,
                pieceData: GamePiecesData[0],
                rotate: 0,
                flip: false
            },
            {
                playerId: 1,
                id: 1,
                pieceData: GamePiecesData[1],
                rotate: 0,
                flip: false
            },
            {
                playerId: 1,
                id: 2,
                pieceData: GamePiecesData[2],
                rotate: 0,
                flip: false
            }
        ];

        act(() => {
            ReactDOM.render(
                <GamePieces
                    playerId={1}
                    gamePieces={gamePieces}
                    onClickPiece={() => {}}
                />,
                container
            );
        });
        const pieces = container.querySelectorAll("[data-game-piece]");
        expect(pieces.length).toBe(3);
    });
});
