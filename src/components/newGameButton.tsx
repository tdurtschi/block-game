import React = require("react");

export function NewGameButton({ startGame }: { startGame: () => void }) {
    return (
        <>
            <button className="btn-primary" data-new-game onClick={startGame}>
                New Game
            </button>
        </>
    );
}