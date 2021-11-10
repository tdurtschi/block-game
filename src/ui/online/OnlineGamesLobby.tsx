import React = require("react");
import { GamesMessage } from "../../server-remote/games-message";
import { OnlineGamesTable } from "./OnlineGamesTable";

interface OnlineGamesLobbyProps {
    createGame: () => any;
    startGame: () => any;
    joinGame: (selectedGameId: number, playerName: string) => any;
    games: GamesMessage;
}

export function OnlineGamesLobby(props: OnlineGamesLobbyProps) {
    const [selectedGameId, setSelectedGameId] = React.useState<number>();
    const [playerName, setPlayerName] = React.useState<string>("");
    const [hasJoinedGame, setHasJoinedGame] = React.useState<boolean>(false);

    const joinGame = () => {
        if(selectedGameId !== undefined){
            props.joinGame(selectedGameId, playerName);
            setHasJoinedGame(true);
        }
    }

    const onGameSelected = (id: number) => {
        if(!hasJoinedGame) setSelectedGameId(id);
    }

    return <>
        <div className="online-games-lobby left-pane">
            <div className="inner flex-column">
                <div className="flex-row space-between">
                    <h2>Online Games Lobby</h2>
                    <div className="flex-column justify-center">
                        <label htmlFor="player-name">Name:</label>
                        <input data-player-name id="player-name" value={playerName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlayerName(e.target.value)} />
                    </div>
                </div>
                <OnlineGamesTable
                    games={props.games}
                    selectedGameId={selectedGameId}
                    onGameSelected={onGameSelected} />
            </div>
        </div>
        <div className="online-games-lobby right-pane">
            <div className="inner">
                <button className="btn-primary" data-new-online-game onClick={props.createGame}>New Online Game</button>
                <button className="btn-primary" data-join-game onClick={joinGame}>Join Game</button>
                <div className="start-game-container">
                    <button className="btn-primary" data-start-game onClick={props.startGame}>Start Game</button>
                    <p>(with {4 - (props.games.find(game => game.id == selectedGameId)?.players ?? 0)} AI Players)</p>
                </div>
            </div>
        </div>
    </>
}