import React = require("react");
import { PlayerConfig } from "../../game-client/playerConfig";
import { ConfirmButton } from "../confirmButton";

export const RegisterPlayers = ({ onPlayersRegistered }: { onPlayersRegistered: (players: PlayerConfig[]) => any }) => {
    const [players, setPlayers] = React.useState<PlayerConfig[]>([
        { name: "Player 1", isAI: false },
        { name: "Player 2", isAI: false },
        { name: "Player 3", isAI: false },
        { name: "Player 4", isAI: false }
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
                    <label>Computer Player:</label>
                    <input data-player-1-ai type="checkbox" checked={players[0].isAI} onChange={() => {
                        players[0].isAI = !players[0].isAI;
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
                    <label>Computer Player:</label>
                    <input data-player-2-ai type="checkbox" checked={players[1].isAI} onChange={() => {
                        players[1].isAI = !players[1].isAI;
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
                    <label>Computer Player:</label>
                    <input data-player-3-ai type="checkbox" checked={players[2].isAI} onChange={() => {
                        players[2].isAI = !players[2].isAI;
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
                    <label>Computer Player:</label>
                    <input data-player-4-ai type="checkbox" checked={players[3].isAI} onChange={() => {
                        players[3].isAI = !players[3].isAI;
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