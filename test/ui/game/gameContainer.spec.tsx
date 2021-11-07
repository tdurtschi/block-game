import { render, screen } from "@testing-library/react";
import React = require("react");
import GameState from "../../../src/shared/types/GameState";
import GameStatus from "../../../src/shared/types/GameStatus";
import GameContainer from "../../../src/ui/game/gameContainer";
import { CreateGameState } from "../../gameStateFixture";

describe('Game Container', () => {
    it('Shows each player\'s name and score', () => {
        const gameState: GameState = CreateGameState(GameStatus.CREATED);
        
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