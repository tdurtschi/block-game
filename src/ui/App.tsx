import { useState } from "react";
import React = require("react");
import { IGameClient } from "../game-client";
import { IOnlineGamesClient } from "../server-remote/gamesClient";
import GameState from "../shared/types/GameState";
import { LocalGame } from "./localGame";
import { NewGame } from "./newGame/newGame";
import OnlineGame from "./onlineGame";

export interface BlockGameProps {
    gameClient: IGameClient;
    onlineGameClient: IOnlineGamesClient,
    errorDisplayTime?: number;
}

function BlockGame({ gameClient, onlineGameClient, errorDisplayTime }: BlockGameProps) {
    const [gameType, setGameType] = useState<"LOCAL" | "ONLINE" | undefined>();
    const [error, setError] = useState<string>();

    const createNewLocalGame = () => {
        setGameType("LOCAL");
    };

    const onlineGameSelected = () => {
        setGameType("ONLINE");
    }

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
                {gameType === "LOCAL" && <LocalGame gameClient={gameClient} setError={setError} />}
                {gameType === "ONLINE" && <>
                    <OnlineGame gamesClient={onlineGameClient} />
                </>}
                {!gameType && (
                    <NewGame startLocalGame={createNewLocalGame} startOnlineGame={onlineGameSelected} />
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
