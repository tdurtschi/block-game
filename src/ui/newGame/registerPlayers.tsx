import React = require("react");
import { ConfirmButton } from "../confirmButton";

export const RegisterPlayers = ({ onPlayersRegistered }: { onPlayersRegistered: (players: { name: string }[]) => any }) => {
    const [players, setPlayers] = React.useState<Array<{ name: string }>>([
        { name: "Player 1" },
        { name: "Player 2" },
        { name: "Player 3" },
        { name: "Player 4" }
    ])

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
            <ConfirmButton label={"Start Game"} action={() => onPlayersRegistered(players)} />
        </div>
    </>
}