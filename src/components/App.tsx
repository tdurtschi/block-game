import { useState } from "react";
import React = require("react");
import GameClient from "../gameClient";
import GameState from "../shared/types/GameState";
import GameStatus from "../shared/types/GameStatus";
import GameContainer from "./gameContainer";

export interface BlockGameProps {
    gameClient: GameClient
}

function BlockGame({ gameClient }: BlockGameProps) {
    const [gameState, setGameState] = useState<GameState>();

    const startGame = () => {
        const initialGameState = gameClient.newGame();
        setGameState(initialGameState);

        gameClient.subscribe(setGameState);
    }

    return (
        <>
            <header>
                <h1>Block Game</h1>
                <button
                    className="btn-primary"
                    disabled={gameState && gameState.status !== GameStatus.OVER}
                    data-new-game
                    onClick={startGame}
                >
                    New Game
        </button>
            </header>
            {
                gameState && <GameContainer
                    gameState={gameState}
                    action={(id, action) => gameClient.action(id, action)}
                />
            }
        </>
    )
};

export default BlockGame;