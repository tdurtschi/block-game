import { useState } from "react";
import React = require("react");
import { IGameClient } from "../game/gameClient";
import Action from "../shared/types/Actions";
import GameState from "../shared/types/GameState";
import GameStatus from "../shared/types/GameStatus";
import PlayerState from "../shared/types/PlayerState";
import GameContainer from "./gameContainer";

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
                    <div data-game-over>
                        <h2>Game Over!</h2>
                        {gameState.players.map((player, i) => (
                            <PlayerScore key={i} player={player} />
                        ))}
                        <h2>{winnerMessage(gameState)}</h2>
                        <h2>Click here to start a new game:</h2>
                        <div style={{ width: "16px" }} />
                        <NewGameButton startGame={startGame} />
                    </div>
                )}
                {!gameState && (
                    <>
                        <div>
                            <div className="flex-row">
                                <h2>Click here to start a new game:</h2>
                                <div style={{ width: "16px" }} />
                                <NewGameButton startGame={startGame} />
                            </div>
                            <div>
                                <h2>
                                    Or
                                    <HelpButton
                                        onClick={() => {
                                            alert("Not Implemented! 🤷‍♂️");
                                        }}
                                    />
                                </h2>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default BlockGame;

function NewGameButton({ startGame }: { startGame: () => void }) {
    return (
        <>
            <button className="btn-primary" data-new-game onClick={startGame}>
                New Game
            </button>
        </>
    );
}

function PlayerScore({ player }: { player: PlayerState }) {
    return (
        <div className={`player-${player.playerId}-score`}>
            <h3>
                Player {player.playerId}:&nbsp;
                <span>{player.score}</span>
            </h3>
        </div>
    );
}

function winnerMessage(gameState: GameState) {
    const orderedPlayers = gameState.players.map((player) => ({
        playerId: player.playerId,
        score: player.score
    }));
    orderedPlayers.sort((a, b) =>
        a.score > b.score ? -1 : a.score === b.score ? 0 : 1
    );
    if (orderedPlayers[0].score === orderedPlayers[1].score) {
        return "Tie game";
    } else {
        return `Player ${orderedPlayers[0].playerId} wins!`;
    }
}

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

const HelpButton = ({ onClick }: { onClick: () => any }) => (
    <a href="" className="help-button" data-help-button onClick={onClick}>
        Learn How To Play
    </a>
);
