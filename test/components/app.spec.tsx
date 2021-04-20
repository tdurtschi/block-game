import React = require("react");
import App from "../../src/components/App";
import { IGameClient } from "../../src/game/gameClient";
import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import GameStatus from "../../src/shared/types/GameStatus";

describe("App", () => {
    describe("Performing a game action", () => {
        it("Displays an error response from the server", async () => {
            const gameClient: IGameClient = {
                subscribe: jest.fn(),
                action: jest.fn().mockReturnValue({ errorMessage: "Test Error" }),
                newGame: jest.fn().mockReturnValue({
                    id: 0,
                    currentPlayer: 1,
                    players: [{
                        playerPieces: [],
                        hasPassed: false,
                        playerId: 1
                    }
                    ],
                    boardState: [],
                    status: GameStatus.CREATED
                })
            }

            render(<App gameClient={gameClient} />);

            fireEvent.click(screen.getByText('New Game'));
            fireEvent.click(screen.getByText('Pass'));

            await waitFor(() => {
                expect(screen.queryByText("Error: Test Error")).not.toBeNull();
            });
        })

        it("Error stops displaying after delay", async () => {
            const gameClient: IGameClient = {
                subscribe: jest.fn(),
                action: jest.fn().mockReturnValue({ errorMessage: "Test Error" }),
                newGame: jest.fn().mockReturnValue({
                    id: 0,
                    currentPlayer: 1,
                    players: [{
                        playerPieces: [],
                        hasPassed: false,
                        playerId: 1
                    }
                    ],
                    boardState: [],
                    status: GameStatus.CREATED
                })
            }

            render(<App gameClient={gameClient} errorDisplayTime={5}/>);

            fireEvent.click(screen.getByText('New Game'));
            fireEvent.click(screen.getByText('Pass'));

            await waitFor(() => {
                expect(screen.queryByText("Error: Test Error")).not.toBeNull();
            });
            await waitFor(() => {
                expect(screen.queryByText("Error: Test Error")).toBeNull();
            });

            fireEvent.click(screen.getByText('Pass'));
            await waitFor(() => {
                expect(screen.queryByText("Error: Test Error")).not.toBeNull();
            });
            await waitFor(() => {
                expect(screen.queryByText("Error: Test Error")).toBeNull();
            });
        })
    })
})
