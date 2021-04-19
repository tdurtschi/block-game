import React = require("react");
import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import { IGameClient } from "../../src/game/gameClient";
import GameStatus from "../../src/shared/types/GameStatus";
import App from "../../src/components/App";

describe('Game Over', () => {
    it("Displays the winner", async () => {
        const gameClient: IGameClient = {
            subscribe: jest.fn(),
            action: jest.fn().mockReturnValue({ errorMessage: "Test Error" }),
            newGame: jest.fn().mockReturnValue({
                id: 0,
                currentPlayer: 1,
                players: [{
                    playerPieces: [],
                    hasPassed: true,
                    playerId: 1,
                    score: 89
                },
                {
                    playerPieces: [[[1]]],
                    hasPassed: true,
                    playerId: 2,
                    score: 88
                }
                ],
                boardState: [],
                status: GameStatus.OVER
            })
        }

        render(<App gameClient={gameClient} />);

        fireEvent.click(screen.getByText('New Game'));

        await waitFor(() => {
            expect(screen.queryByText("Player 1 wins!")).not.toBeNull();
        });
    });
});