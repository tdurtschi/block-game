import { IOnlineGamesClient } from "../src/server-remote/gamesClient";

export function fakeOnlineClient(config: Partial<IOnlineGamesClient> = {}) {
    return Object.assign(
        {
            subscribe: jest.fn(),
            action: jest.fn(),
            newGame: jest.fn(),
            registerPlayer: jest.fn(),
            startGame: jest.fn(),
            canRejoinGame: jest.fn(),
            rejoinGame: jest.fn()
        },
        config
    ) as IOnlineGamesClient;
}
