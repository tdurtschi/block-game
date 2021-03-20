import { useState } from "react";
import React = require("react");
import { IGameClient } from "../gameClient";
import Action from "../shared/types/Actions";
import GameState from "../shared/types/GameState";
import GameContainer from "./gameContainer";

export interface BlockGameProps {
    gameClient: IGameClient
}

function BlockGame({ gameClient }: BlockGameProps) {
    const [gameState, setGameState] = useState<GameState>();
    const [error, setError] = useState<string>();

    const startGame = () => {
        const initialGameState = gameClient.newGame();
        setGameState(initialGameState);

        gameClient.subscribe(setGameState);
    }

    const submitAction = (action: Action) => {
        const result = gameClient.action(action);

        if (result.errorMessage) {
            setError(result.errorMessage);
        }
        return result;
    }

    return (
        <>
            <header>
                <h1>Block Game</h1>

            </header>
            <div
                className={`game-container`}
                onContextMenu={(e) => { e.preventDefault(); return false }}
            >
                {!gameState &&
                    <>
                        <h2>Click here to start a new game:</h2>
                        <div style={{ width: "16px" }} />
                        <button
                            className="btn-primary"
                            data-new-game
                            onClick={startGame}
                        >
                            New Game
                        </button>
                    </>
                }

                {gameState &&
                    <GameContainer
                        gameState={gameState}
                        action={submitAction}
                    />
                }
            </div>
            {error && <div className={`error-message-container`}>Error: {error}</div>}
        </>
    )
};

export default BlockGame;