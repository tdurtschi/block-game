import React = require("react");
import { ConfirmButton } from "../ConfirmButton";
import { HelpButton } from "../help/Help";
import { NewGameButton } from "./newGameButton";

export function NewGame({ startGame }: { startGame: () => any }) {
    const [showRegisterPlayers, setShowRegisterPlayers] = React.useState<boolean>(false);

    const [players, setPlayers] = React.useState<Array<{ name: string }>>([
        { name: "Player 1" },
        { name: "Player 2" },
        { name: "Player 3" },
        { name: "Player 4" }
    ])

    if (showRegisterPlayers) {
        return <>
            <div className="new-game">
                <div>
                    <div>
                        Player 1:
                        <input data-player-1-name type="text" value={players[0].name} onChange={(event) => {
                            players[0].name = event.target.value;
                            setPlayers([...players]);
                        }} />
                    </div>
                    <div>
                        Player 2:
                        <input data-player-2-name type="text" value={players[1].name} onChange={(event) => {
                            players[1].name = event.target.value;
                            setPlayers([...players]);
                        }} />
                    </div>
                    <div>
                        Player 3:
                        <input data-player-3-name type="text" value={players[2].name} onChange={(event) => {
                            players[2].name = event.target.value;
                            setPlayers([...players]);
                        }} />
                    </div>
                    <div>
                        Player 4:
                        <input data-player-4-name type="text" value={players[3].name} onChange={(event) => {
                            players[3].name = event.target.value;
                            setPlayers([...players]);
                        }} />
                    </div>
                </div>
                <ConfirmButton label={"Start Game"} action={startGame} />
            </div>
        </>;
    } else {
        return <>
            <div className="new-game">
                <div className="flex-row">
                    <h2>Click here to start a new game:</h2>
                    <div style={{ width: "16px" }} />
                    <NewGameButton startGame={() => setShowRegisterPlayers(true)} />
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
}
