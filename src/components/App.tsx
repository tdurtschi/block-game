import { useState } from "react";
import React = require("react");
import { IGameClient } from "../gameClient";
import Action from "../shared/types/Actions";
import GameState from "../shared/types/GameState";
import GameStatus from "../shared/types/GameStatus";
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
                {(gameState && gameState.status !== GameStatus.OVER) &&
                    <GameContainer
                        gameState={gameState}
                        action={submitAction}
                    />
                }
                {(gameState && gameState.status === GameStatus.OVER) && <div>
                    <h2 data-game-over>Game Over!</h2>
                    <h2>Click here to start a new game:</h2>
                    <div style={{ width: "16px" }} />
                    <NewGameButton startGame={startGame} />
                </div>}
                {!gameState && <>
                    <h2>Click here to start a new game:</h2>
                    <div style={{ width: "16px" }} />
                    <NewGameButton startGame={startGame} />
                </>}
            </div>
            {error && <div className={`error-message-container`}>Error: {error}</div>}
        </>
    )
};



export default BlockGame;

function NewGameButton({ startGame }: { startGame: () => void }) {
    return <>
        <button
            className="btn-primary"
            data-new-game
            onClick={startGame}
        >
            New Game
        </button>
    </>;
}
