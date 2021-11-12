import { render } from "@testing-library/react";
import React = require("react");
import GameStatus from "../../../src/shared/types/GameStatus";
import { OnlineGame } from "../../../src/ui/online/OnlineGame";
import { CreateGameState } from "../../gameStateFixture";

describe("Online Game", () => {
    it("Shows the final score at the end of the game", () => {
        render(<OnlineGame games={[]}
            createGame={jest.fn()}
            joinGame={jest.fn()}
            startGame={jest.fn()}
            action={jest.fn()}
            gameState={CreateGameState(GameStatus.OVER)}
            goHome={jest.fn()}
        />);
        
        expect(document.querySelector("[data-game-over]")).not.toBeNull();
    });
});