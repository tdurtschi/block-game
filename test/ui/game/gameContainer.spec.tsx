import { render, screen } from "@testing-library/react";
import React = require("react");
import GameState from "../../../src/shared/types/GameState";
import GameStatus from "../../../src/shared/types/GameStatus";
import GameContainer from "../../../src/ui/game/gameContainer";

describe('Game Container', () => {
    it('Shows each player\'s name and score', () => {
        const gameState: GameState = {
            id: 1,
            currentPlayerId: 1,
            players: [{
                playerPieces: [],
                hasPassed: true,
                playerId: 1,
                name: "Player 1",
                score: 100
            },
            {
                playerPieces: [],
                hasPassed: true,
                playerId: 2,
                name: "Player 2",
                score: 200
            },
            {
                playerPieces: [],
                hasPassed: true,
                playerId: 3,
                name: "Player 3",
                score: 300
            },
            {
                playerPieces: [],
                hasPassed: true,
                playerId: 4,
                name: "Player 4",
                score: 400
            }],
            boardState: [],
            status: GameStatus.CREATED
        };
        render(<GameContainer gameState={gameState} action={jest.fn()} />);

        screen.getByText('Player 1');
        expect(screen.getByTestId('player-1-score').textContent).toEqual('100');
        screen.getByText('Player 2');
        expect(screen.getByTestId('player-2-score').textContent).toEqual('200');
        screen.getByText('Player 3');
        expect(screen.getByTestId('player-3-score').textContent).toEqual('300');
        screen.getByText('Player 4');
        expect(screen.getByTestId('player-4-score').textContent).toEqual('400');
    });
});