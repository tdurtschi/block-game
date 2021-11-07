import React = require("react");
import { GamesMessage } from "../../server-remote/games-message";

export interface OnlineGamesTableProps {
    games: GamesMessage;
    onGameSelected: (id: number) => any;
    selectedGameId: number | undefined;
}

export function OnlineGamesTable(props: OnlineGamesTableProps) {
    return <div className="online-game-list">
        <table data-games-list cellSpacing={0}>
            <thead>
                <tr>
                    <th><h3>Game ID</h3></th>
                    <th><h3>Number of Players</h3></th>
                </tr>
            </thead>
            <tbody>
                {props.games.map((game) =>
                    <tr key={game.id} 
                        className={props.selectedGameId === game.id ? "selected" : ""}
                        onClick={() => props.onGameSelected(game.id)}>
                        <td>Game {`${game.id}`.padStart(3, '0')}</td>
                        <td>{`${game.players}/4`}</td>
                    </tr>)
                }
            </tbody>
        </table>
    </div>
}
