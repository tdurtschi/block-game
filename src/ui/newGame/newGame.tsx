import React = require("react");
import { HelpButton } from "../help/Help";
import { NewGameButton } from "./newGameButton";

export function NewGame({
    startLocalGame,
    startOnlineGame
}: {
    startLocalGame: () => any;
    startOnlineGame: () => any;
}) {
    return (
        <>
            <div data-home className="new-game">
                <h1 style={{}}>Block Game</h1>
                <h2 className="h3">Start a local game:</h2>
                <NewGameButton startGame={startLocalGame} />
                <h2 className="h3">Create or join an online game:</h2>
                <button
                    className="btn-primary"
                    data-online-game
                    onClick={startOnlineGame}
                >
                    Online Game Lobby
                </button>
                <div style={{ height: "16px" }}></div>
                <HelpButton />
            </div>
        </>
    );
}
