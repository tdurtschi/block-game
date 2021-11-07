import React = require("react");
import { HelpButton } from "../help/Help";
import { NewGameButton } from "./newGameButton";

export function NewGame({ startLocalGame, startOnlineGame }: { startLocalGame: () => any, startOnlineGame: () => any }) {
    return <>
        <div data-home className="new-game">
            <div className="flex-row">
                <h2>Click here to start a new game:</h2>
                <div style={{ width: "16px" }} />
                <NewGameButton startGame={startLocalGame} />
                <button className="btn-primary" data-online-game onClick={startOnlineGame}>
                    New Online Game
                </button>
            </div>
            <div>
                <h2>
                    Or
                    <HelpButton />
                </h2>
            </div>
        </div>
    </>
}
