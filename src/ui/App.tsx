import { useState } from "react";
import React = require("react");
import { IGameClient } from "../local-game/gameClient";
import { IOnlineGamesClient } from "../server-remote/gamesClient";
import GameState from "../shared/types/GameState";
import { LocalGame } from "./LocalGame";
import { NewGame } from "./newGame/newGame";
import OnlineGameContainer from "./online/OnlineGameContainer";
import { Error } from "./Error";

export interface BlockGameProps {
    gameClient: IGameClient;
    onlineGameClient: IOnlineGamesClient,
    errorDisplayTime?: number;
}


function BlockGame({ gameClient, onlineGameClient, errorDisplayTime }: BlockGameProps) {
    const [gameType, setGameType] = useState<"LOCAL" | "ONLINE" | undefined>();
    const [error, setError] = useState<string>();
    const [showRejoinPrompt, setShowRejoinPrompt] = useState<boolean>(onlineGameClient.canRejoinGame());

    const createNewLocalGame = () => {
        setGameType("LOCAL");
    };

    const onlineGameSelected = () => {
        setGameType("ONLINE");
    }

    const goHome = () => {
        setGameType(undefined);
    }

    const rejoinGame = async () => {
        onlineGameSelected();
        onlineGameClient.rejoinGame();
        setShowRejoinPrompt(false)
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
                {gameType === "LOCAL" && <LocalGame gameClient={gameClient} setError={setError} goHome={goHome} />}
                {gameType === "ONLINE" && <OnlineGameContainer gamesClient={onlineGameClient} goHome={goHome} />}
                {!gameType && <NewGame startLocalGame={createNewLocalGame} startOnlineGame={onlineGameSelected} />}
            </div>
            {showRejoinPrompt && !gameType && <div className="rejoin-prompt">
                Were you in the middle of an online game? <button data-rejoin-game onClick={rejoinGame} className="btn-primary">Click here</button> to rejoin.
            </div>}
        </>
    );
}


export interface GameOverProps {
    gameState: GameState;
    startGame: () => any;
}

export default BlockGame;
