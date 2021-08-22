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
        <div className="register-players">
            <h2>Player Info:</h2>
            <div>
                <div className="player-info">
                    <h3>Player 1:</h3>
                    <label>Name:</label>
                    <input data-player-1-name type="text" value={players[0].name} onChange={(event) => {
                        players[0].name = event.target.value;
                        setPlayers([...players]);
                    }} />
                </div>
                <div className="player-info">
                    <h3>Player 2:</h3>
                    <label>Name:</label>
                    <input data-player-2-name type="text" value={players[1].name} onChange={(event) => {
                        players[1].name = event.target.value;
                        setPlayers([...players]);
                    }} />
                </div>
                <div className="player-info">
                    <h3>Player 3:</h3>
                    <label>Name:</label>
                    <input data-player-3-name type="text" value={players[2].name} onChange={(event) => {
                        players[2].name = event.target.value;
                        setPlayers([...players]);
                    }} />
                </div>
                <div className="player-info">
                    <h3>Player 4:</h3>
                    <label>Name:</label>
                    <input data-player-4-name type="text" value={players[3].name} onChange={(event) => {
                        players[3].name = event.target.value;
                        setPlayers([...players]);
                    }} />
                </div>
            </div>
            <div className={"action-buttons"}>
                <ConfirmButton label={"Start Game"} action={() => onPlayersRegistered(players)} />
            </div>
        </div>
    </>
}