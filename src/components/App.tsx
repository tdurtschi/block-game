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

            </header>
            <div
                className={`game-container`}
                onContextMenu={(e) => { e.preventDefault(); return false }}
            >
                {!gameState &&
                    <>
                        <h2>Click here to start a new game:</h2>
                        <div style={{ width: "16px" }}/>
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
                    action={(id, action) => gameClient.action(id, action)}
                />
            }

        </div>
        </>
    )
};

export default BlockGame;