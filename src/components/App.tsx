import { useState } from "react";
import React = require("react");
import { IGameClient } from "../frontend/gameClient";
import Action from "../shared/types/Actions";
import GameState from "../shared/types/GameState";
import GameStatus from "../shared/types/GameStatus";
import GameContainer from "./gameContainer";
import { GameOver } from "./gameOver";
import { HelpButton } from "./Help";
import { NewGameButton } from "./newGameButton";

export interface BlockGameProps {
    gameClient: IGameClient;
    errorDisplayTime?: number;
}

function BlockGame({ gameClient, errorDisplayTime }: BlockGameProps) {
    const [gameState, setGameState] = useState<GameState>();
    const [error, setError] = useState<string>();

    const startGame = () => {
        const initialGameState = gameClient.newGame();
        setGameState(initialGameState);

        gameClient.subscribe(setGameState);
    };

    const submitAction = (action: Action) => {
        const result = gameClient.action(action);

        if (result.errorMessage) {
            setError(result.errorMessage);
        }
        return result;
    };

    return (
        <>
            <header className="flex-row">
                <h1>Block Game</h1>
                <Error
                    errorText={error ?? ""}
                    errorDisplayTime={errorDisplayTime}
                    clearError={() => {
                        setError(undefined);
                    }}
                />
            </header>
            <div
                className={`game-container`}
                onContextMenu={(e) => {
                    e.preventDefault();
                    return false;
                }}
            >
                {gameState && gameState.status !== GameStatus.OVER && (
                    <GameContainer
                        gameState={gameState}
                        action={submitAction}
                    />
                )}
                {gameState && gameState.status === GameStatus.OVER && (
                    <GameOver gameState={gameState} startGame={startGame}/>
                )}
                {!gameState && (
                    <>
                        <div className="new-game">
                            <div className="flex-row">
                                <h2>Click here to start a new game:</h2>
                                <div style={{ width: "16px" }} />
                                <NewGameButton startGame={startGame} />
                            </div>
                            <div>
                                <h2>
                                    Or
                                    <HelpButton />
                                </h2>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export interface GameOverProps {
    gameState: GameState;
    startGame: () => any;
}

export default BlockGame;

export interface ErrorState {
    errorDisplayTime?: number;
    errorText: string;
    clearError: () => any;
}

function Error(errorState: ErrorState) {
    const [displayError, setDisplayError] = useState<boolean>(false);

    React.useEffect(() => {
        setDisplayError(true);
        setTimeout(() => {
            setDisplayError(false);
            errorState.clearError();
        }, errorState.errorDisplayTime || 6000);
    }, [errorState.errorText]);

    return (
        (displayError && errorState.errorText && (
            <div className={`error-message-container`}>
                Error: {errorState.errorText}
            </div>
        )) || <></>
    );
}
