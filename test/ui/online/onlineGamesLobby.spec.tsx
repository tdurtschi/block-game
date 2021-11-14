import React = require("react");
import { render, fireEvent, screen } from "@testing-library/react";
import { OnlineGamesLobby } from "../../../src/ui/online/OnlineGamesLobby";
import GameStatus from "../../../src/shared/types/GameStatus";

describe("OnlineGamesLobby", () => {
        it("Doesn't allow to select a game after joining", async () => {
            render(<OnlineGamesLobby games={[{id: 0, players: 0, status: GameStatus.CREATED},{id: 1, players: 0, status: GameStatus.CREATED}]}
                    createGame={jest.fn()}
                    joinGame={jest.fn()}
                    startGame={jest.fn()}
                />);

            fireEvent.click(screen.getByText("Game 000"));
            fireEvent.click(screen.getByText("Join Game"));
            fireEvent.click(screen.getByText("Game 001"));

            expect(document.querySelector(".selected")?.textContent).toContain("Game 000");
        });
        
        it("Shows the game status", async () => {
            render(<OnlineGamesLobby games={[{id: 0, players: 0, status: GameStatus.STARTED}]}
                    createGame={jest.fn()}
                    joinGame={jest.fn()}
                    startGame={jest.fn()}
                />);

            fireEvent.click(screen.getByText("Game 000"));
            expect(document.querySelector(".selected")?.textContent).toContain("Started");
        });
});
