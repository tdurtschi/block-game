import React = require("react");
import { render, fireEvent, screen } from "@testing-library/react";
import { OnlineGamesLobby } from "../../../src/ui/online/OnlineGamesLobby";
import GameStatus from "../../../src/shared/types/GameStatus";
import { GamesMessage } from "../../../src/server-remote/games-message";

describe("OnlineGamesLobby", () => {
        it("Shows the game status", async () => {
            renderLobby([{id: 0, players: 1, status: GameStatus.STARTED}]);

            fireEvent.click(screen.getByText("Game 000"));
            expect(document.querySelector(".selected")?.textContent).toContain("Started");
        });

        it("Doesn't allow joining a game without a player name", () => {
            renderLobby([{id: 0, players: 1, status: GameStatus.CREATED}]);
            
            fireEvent.click(screen.getByText("Game 000"));

            const isJoinButtonDisabled = (document.querySelector("[data-join-game]") as HTMLButtonElement).disabled;
            expect(isJoinButtonDisabled).toBeTruthy();
        });
        
        it("Doesn't allow joining a game if no game is selected", () => {
            renderLobby([{id: 0, players: 1, status: GameStatus.CREATED}]);
            
            fireEvent.change(document.querySelector('[data-player-name]')!, {target: {value: "Player 1"}});
            
            const isJoinButtonDisabled = (document.querySelector("[data-join-game]") as HTMLButtonElement).disabled;
            expect(isJoinButtonDisabled).toBeTruthy();
        });

        it("Doesn't allow joining a game if 4/4 players registered", () => {
            renderLobby([{id: 0, players: 4, status: GameStatus.CREATED}]);
            
            fireEvent.change(document.querySelector('[data-player-name]')!, {target: {value: "Player 1"}});
            fireEvent.click(screen.getByText("Game 000"));

            const isJoinButtonDisabled = (document.querySelector("[data-join-game]") as HTMLButtonElement).disabled;
            expect(isJoinButtonDisabled).toBeTruthy();
        });

        it("Doesn't allow to select a game after joining", async () => {
            renderLobby([{id: 0, players: 0, status: GameStatus.CREATED},{id: 1, players: 0, status: GameStatus.CREATED}]);

            fireEvent.change(document.querySelector('[data-player-name]')!, {target: {value: "Player 1"}});

            fireEvent.click(screen.getByText("Game 000"));
            fireEvent.click(screen.getByText("Join Game"));
            fireEvent.click(screen.getByText("Game 001"));

            expect(document.querySelector(".selected")?.textContent).toContain("Game 000");
        });
});

function renderLobby(games: GamesMessage = []){
    render(<OnlineGamesLobby games={games}
        createGame={jest.fn()}
        joinGame={jest.fn()}
        startGame={jest.fn()}
        />);
}