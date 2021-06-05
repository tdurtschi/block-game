import React = require("react");
import { HelpButton } from "../help/Help";
import { NewGameButton } from "./newGameButton";

export function NewGame({ startGame }: { startGame: () => any }) {
    return <>
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
}
