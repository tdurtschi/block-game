import React = require("react");
import { HelpButton } from "../help/Help";
import { NewGameButton } from "./newGameButton";

export function NewGame({ startLocalGame: startGame }: { startLocalGame: () => any }) {
    return <>
        <div className="new-game">
            <div className="flex-row">
                <h2>Click here to start a new game:</h2>
                <div style={{ width: "16px" }} />
                <NewGameButton startGame={startGame} />
                <button className="btn-primary" data-online-game onClick={startGame}>
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
