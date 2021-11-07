import React = require("react");
import App from "../../src/ui/App";
import { IGameClient } from "../../src/game-client";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import GameStatus from "../../src/shared/types/GameStatus";
import { IOnlineGamesClient } from "../../src/server-remote/gamesClient";

describe("App", () => {
    describe("Performing a game action", () => {
        it("Displays an error response from the server", async () => {
            const gameClient: IGameClient = {
                subscribe: jest.fn(),
                action: jest
                    .fn()
                    .mockReturnValue({ errorMessage: "Test Error" }),
                newGame: jest.fn().mockReturnValue({
                    id: 0,
                    currentPlayerId: 1,
                    players: [
                        {
                            playerPieces: [],
                            hasPassed: false,
                            playerId: 1
                        }
                    ],
                    boardState: [],
                    status: GameStatus.STARTED
                }),
                registerPlayer: jest.fn(),
                startGame: jest.fn()
            };

            const onlineGameClient: IOnlineGamesClient = {
                connect: jest.fn(),
                createGame: jest.fn(),
                joinGame: jest.fn(),
                startGame: jest.fn(),
                gameAction: jest.fn()
            }

            render(<App gameClient={gameClient} onlineGameClient={onlineGameClient} />);

            fireEvent.click(screen.getByText("New Game"));
            pass();

            await waitFor(() => {
                expect(screen.queryByText("Error: Test Error")).not.toBeNull();
            });
        });

        it("Error stops displaying after delay", async () => {
            const gameClient: IGameClient = {
                subscribe: jest.fn(),
                action: jest
                    .fn()
                    .mockReturnValue({ errorMessage: "Test Error" }),
                newGame: jest.fn().mockReturnValue({
                    id: 0,
                    currentPlayerId: 1,
                    players: [
                        {
                            playerPieces: [],
                            hasPassed: false,
                            playerId: 1,
                            name: "WHATEVER"
                        }
                    ],
                    boardState: [],
                    status: GameStatus.STARTED
                }),
                registerPlayer: jest.fn(),
                startGame: jest.fn()
            };

            const onlineGameClient: IOnlineGamesClient = {
                connect: jest.fn(),
                createGame: jest.fn(),
                joinGame: jest.fn(),
                startGame: jest.fn(),
                gameAction: jest.fn()
            }

            render(<App gameClient={gameClient} onlineGameClient={onlineGameClient} errorDisplayTime={5} />);

            fireEvent.click(screen.getByText("New Game"));

            pass();
            await waitFor(() => {
                expect(screen.queryByText("Error: Test Error")).not.toBeNull();
            });
            await waitFor(() => {
                expect(screen.queryByText("Error: Test Error")).toBeNull();
            });

            pass();
            await waitFor(() => {
                expect(screen.queryByText("Error: Test Error")).not.toBeNull();
            });
            await waitFor(() => {
                expect(screen.queryByText("Error: Test Error")).toBeNull();
            });
        });
    });

    describe("Finishing a game", () => {
        it("Returns to the home screen TODO!");
    })
});

function pass() {
    fireEvent.click(screen.getByText("Pass"));
    fireEvent.click(screen.getByText("Confirm Pass"));
}