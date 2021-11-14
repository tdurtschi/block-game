import React = require("react");
import { render, fireEvent, screen } from "@testing-library/react";
import { OnlineGamesLobby } from "../../../src/ui/online/OnlineGamesLobby";
import GameStatus from "../../../src/shared/types/GameStatus";
import { GamesMessage } from "../../../src/server-remote/games-message";

describe("OnlineGamesLobby", () => {
        it("Shows the game status", async () => {
            renderLobby([{id: 0, players: 1, status: GameStatus.STARTED}]);

            clickOn("Game 000");
            expect(document.querySelector(".selected")?.textContent).toContain("Started");
        });

        it("Doesn't allow starting a game without joining", () => {
            renderLobby([{id: 0, players: 1, status: GameStatus.CREATED}]);
            
            const isStartButtonDisabled = isButtonDisabled("[data-start-game]");
            expect(isStartButtonDisabled).toBeTruthy();
        });

        it("Doesn't allow joining a game without a player name", () => {
            renderLobby([{id: 0, players: 1, status: GameStatus.CREATED}]);
            
            clickOn("Game 000");

            const isJoinButtonDisabled = isButtonDisabled("[data-join-game]");
            expect(isJoinButtonDisabled).toBeTruthy();
        });

        it("Doesn't allow creating a game without a player name", () => {
            renderLobby([{id: 0, players: 1, status: GameStatus.CREATED}]);
            
            clickOn("Game 000");

            const isCreateGameButtonDisabled = isButtonDisabled("[data-new-online-game]");
            expect(isCreateGameButtonDisabled).toBeTruthy();
        })
        
        it("Doesn't allow joining a game if no game is selected", () => {
            renderLobby([{id: 0, players: 1, status: GameStatus.CREATED}]);
            
            enterName();
            
            const isJoinButtonDisabled = isButtonDisabled("[data-join-game]");
            expect(isJoinButtonDisabled).toBeTruthy();
        });

        it("Doesn't allow joining a game if 4/4 players registered", () => {
            renderLobby([{id: 0, players: 4, status: GameStatus.CREATED}]);
            
            enterName();
            clickOn("Game 000");

            const isJoinButtonDisabled = isButtonDisabled("[data-join-game]");
            expect(isJoinButtonDisabled).toBeTruthy();
        });

        it("Doesn't allow to select a game after joining", async () => {
            renderLobby([{id: 0, players: 0, status: GameStatus.CREATED},{id: 1, players: 0, status: GameStatus.CREATED}]);

            enterName();

            clickOn("Game 000");
            clickOn("Join Game");
            clickOn("Game 001");

            expect(document.querySelector(".selected")?.textContent).toContain("Game 000");
        });

        it("Allows starting a game after joining", async () => {
            renderLobby([{id: 0, players: 0, status: GameStatus.CREATED}]);

            enterName();

            clickOn("Game 000");
            clickOn("Join Game");

            const isStartButtonDisabled = isButtonDisabled("[data-start-game]");
            expect(isStartButtonDisabled).toBeFalsy();
        });

        it("Doesn't allow to join a game after joining", async () => {
            renderLobby([{id: 0, players: 0, status: GameStatus.CREATED}]);

            enterName();

            clickOn("Game 000");
            clickOn("Join Game");

            const isJoinButtonDisabled = isButtonDisabled("[data-join-game]");
            expect(isJoinButtonDisabled).toBeTruthy();
        });

        it("Doesn't show AI info before joining game", async () => {
            renderLobby([{id: 0, players: 0, status: GameStatus.CREATED}]);

            const aiInfo = document.body.textContent;
            expect(aiInfo).not.toContain("AI Players");
        });

        it("Shows AI info after joining game", async () => {
            renderLobby([{id: 0, players: 0, status: GameStatus.CREATED}]);

            enterName();

            clickOn("Game 000");
            clickOn("Join Game");

            const aiInfo = document.body.textContent;
            expect(aiInfo).toContain("AI Players");
        });
});

function clickOn(gameText: string) {
    fireEvent.click(screen.getByText(gameText));
}

function isButtonDisabled(selector: string): boolean {
    return (document.querySelector(selector) as HTMLButtonElement).disabled;
}

function enterName() {
    fireEvent.change(document.querySelector('[data-player-name]')!, {target: {value: "Player 1"}})
}

function renderLobby(games: GamesMessage = []){
    render(<OnlineGamesLobby games={games}
        createGame={jest.fn()}
        joinGame={jest.fn()}
        startGame={jest.fn()}
        />);
}