import React = require("react");
import App from "../../src/ui/App";
import { IGameClient } from "../../src/local-game/gameClient";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import GameStatus from "../../src/shared/types/GameStatus";
import { IOnlineGamesClient } from "../../src/server-remote/gamesClient";
import _ = require("cypress/types/lodash");
import { CreateGameState } from "../gameStateFixture";
import { testGameFixture } from "../testGameFixture";

describe("App", () => {
    describe("Performing a game action", () => {
        it("Displays an error response from the server", async () => {
            const gameClient: IGameClient = fakeLocalClient({
                    action: jest.fn().mockReturnValue({ 
                        errorMessage: "Test Error" 
                    }),
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
                    })
                });

            const onlineGameClient: IOnlineGamesClient = fakeOnlineClient();

            render(<App gameClient={gameClient} onlineGameClient={onlineGameClient} />);

            fireEvent.click(screen.getByText("New Game"));
            pass();

            await waitFor(() => {
                expect(screen.queryByText("Error: Test Error")).not.toBeNull();
            });
        });

        it("Error stops displaying after delay", async () => {
            const gameClient: IGameClient = fakeLocalClient({
                action: jest.fn().mockReturnValue({ 
                    errorMessage: "Test Error" 
                }),
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
                })
            });

            const onlineGameClient: IOnlineGamesClient = fakeOnlineClient();

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

    describe("Navigating back", () => {
        it("Returns to home screen from player registration", async () => {
            const gameClient: IGameClient = fakeLocalClient({
                newGame: jest.fn().mockReturnValue(CreateGameState(GameStatus.CREATED))
            });
            const onlineGameClient: IOnlineGamesClient = fakeOnlineClient();
            render(<App gameClient={gameClient} onlineGameClient={onlineGameClient} />);
            fireEvent.click(screen.getByText("New Game"));
            
            fireEvent.click(await screen.findByText("Go Back"));

            await screen.findByText("New Game");
        })

        it("Returns to home screen from online lobby", async () => {
            const gameClient: IGameClient = fakeLocalClient();
            const onlineGameClient: IOnlineGamesClient = fakeOnlineClient({
                connect: ((_, __) => {
                    return new Promise((resolve, _) => setTimeout(() => resolve(undefined), 0));
                })
            });

            render(<App gameClient={gameClient} onlineGameClient={onlineGameClient} />);
            fireEvent.click(screen.getByText("New Online Game"));
            
            fireEvent.click(await screen.findByText("Go Back"));

            await screen.findByText("New Online Game");
        })

        it("Returns home after a connection failure", async () => {
            const gameClient: IGameClient = fakeLocalClient();
            const onlineGameClient: IOnlineGamesClient = fakeOnlineClient({
                connect: ((_, __) => {
                    return new Promise((_, reject) => setTimeout(() => reject(undefined), 0));
                })
            });

            render(<App gameClient={gameClient} onlineGameClient={onlineGameClient} />);
            fireEvent.click(screen.getByText("New Online Game"));
            
            fireEvent.click(await screen.findByText("Go Back"));

            await screen.findByText("New Online Game");
        })
    })

    describe("Finishing a game", () => {
        it("Clicks a button to return to the home screen (online)", async () => {
            const gameState = CreateGameState(GameStatus.OVER);

            const gameClient: IGameClient = fakeLocalClient();

            const onlineGameClient: IOnlineGamesClient = fakeOnlineClient({
                    connect: ((_, onGameUpdate: (...args: any[]) => any) => {
                        onGameUpdate(gameState);

                        return new Promise((resolve, reject) => setTimeout(() => resolve(undefined), 0));
                    })
                });

            render(<App gameClient={gameClient} onlineGameClient={onlineGameClient} />);

            fireEvent.click(screen.getByText("New Online Game"));
            await waitFor(() => {
                expect(document.querySelector("[data-game-over]")).not.toBeNull();
            });

            fireEvent.click(screen.getByText("New Game"));
            await waitFor(() => {
                expect(document.querySelector("[data-home]")).not.toBeNull();
            });
        });

        it("Clicks a button to return to the home screen (local)", async () => {
            const gameState = CreateGameState(GameStatus.OVER);

            const gameClient: IGameClient = fakeLocalClient({
                subscribe: (onUpdate => onUpdate(gameState))
            });

            const onlineGameClient: IOnlineGamesClient = fakeOnlineClient();

            render(<App gameClient={gameClient} onlineGameClient={onlineGameClient} />);

            fireEvent.click(screen.getByText("New Game"));
            await waitFor(() => {
                expect(document.querySelector("[data-game-over]")).not.toBeNull();
            });

            fireEvent.click(screen.getByText("New Game"));
            await waitFor(() => {
                expect(document.querySelector("[data-home]")).not.toBeNull();
            });
        });
    })
});

function pass() {
    fireEvent.click(screen.getByText("Pass"));
    fireEvent.click(screen.getByText("Confirm Pass"));
}

function fakeOnlineClient(config: Partial<IOnlineGamesClient> = {}){
    return Object.assign({
        subscribe: jest.fn(),
        action: jest.fn(),
        newGame: jest.fn(),
        registerPlayer: jest.fn(),
        startGame: jest.fn()
    }, config) as IOnlineGamesClient;
}

function fakeLocalClient(config: Partial<IGameClient> = {}){
    return Object.assign({
        subscribe: jest.fn(),
        action: jest.fn(),
        newGame: jest.fn(),
        registerPlayer: jest.fn(),
        startGame: jest.fn()
    }, config) as IGameClient;
}