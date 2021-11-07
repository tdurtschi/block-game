import React = require("react");
import { render, fireEvent, screen } from "@testing-library/react";
import { OnlineGamesLobby } from "../../../src/ui/online/OnlineGamesLobby";

describe("OnlineGamesLobby", () => {
        it("Doesn't allow to select a game after joining", async () => {
            render(<OnlineGamesLobby games={[{id: 0, players: 0},{id: 1, players: 0}]}
                    createGame={jest.fn()}
                    joinGame={jest.fn()}
                    startGame={jest.fn()}
                />);

            fireEvent.click(screen.getByText("Game 000"));
            fireEvent.click(screen.getByText("Join Game"));
            fireEvent.click(screen.getByText("Game 001"));

            expect(document.querySelector(".selected")?.textContent).toContain("Game 000");
        });
});
