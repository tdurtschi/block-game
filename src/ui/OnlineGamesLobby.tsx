import React = require("react");
import { GamesMessage } from "../server-remote/games-message";
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
        <div className="left-pane">
            <div className="inner">
                <h2>Online Games Lobby</h2>
                <OnlineGamesTable
                    games={props.games}
                    selectedGameId={selectedGameId}
                    onGameSelected={onGameSelected} />
                <button className="btn-primary" data-new-online-game onClick={props.createGame}>New Online Game</button>
            </div>
        </div>
        <div className="right-pane">
            <div className="inner">
                <label htmlFor="player-name">Name:</label>
                <input data-player-name id="player-name" value={playerName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlayerName(e.target.value)} />
                <button className="btn-primary" data-join-game onClick={joinGame}>Join Game</button>
                <button className="btn-primary" data-start-game onClick={props.startGame}>Start Game</button>
                <span>with {4 - (props.games.find(game => game.id == selectedGameId)?.players ?? 0)} AI Players</span>
            </div>
        </div>
    </>
}