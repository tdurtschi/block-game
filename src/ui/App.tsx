import { useState } from "react";
import React = require("react");
import { IGameClient } from "../game-client";
import Action from "../shared/types/Actions";
import GameState from "../shared/types/GameState";
import GameStatus from "../shared/types/GameStatus";
import GameContainer from "./game/gameContainer";
import { GameOver } from "./gameOver";
import { NewGame } from "./newGame/newGame";

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
        gameClient.registerPlayer("Player 1");
        gameClient.registerPlayer("Player 2");
        gameClient.registerPlayer("Player 3");
        gameClient.registerPlayer("Player 4");
        gameClient.startGame();
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
            <div className={"mobile-warning-banner"}>😭 Oh no, it looks like you're using a mobile device. Sorry, Block Game doesn't yet support mobile!</div>
            <header className="flex-row">
                <h1>{`Block Game v${require("../../package.json").version}`}</h1>
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
                    <GameOver gameState={gameState} startGame={startGame} />
                )}
                {!gameState && (
                    <NewGame startGame={startGame} />
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
    const [errorDisplayTimeout, setErrorDisplayTimeout] = useState<NodeJS.Timeout | undefined>(undefined);

    React.useEffect(() => {
        setDisplayError(true);
        errorDisplayTimeout && clearTimeout(errorDisplayTimeout);
        setErrorDisplayTimeout(setTimeout(() => {
            setDisplayError(false);
            errorState.clearError();
        }, errorState.errorDisplayTime || 6000));
    }, [errorState.errorText]);

    return (
        (displayError && errorState.errorText && (
            <div className={`error-message-container`}>
                Error: {errorState.errorText}
            </div>
        )) || <></>
    );
}
