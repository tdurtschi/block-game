import React = require("react");
import { GamesMessage, GamesMessageGame } from "../../server-remote/games-message";
import { OnlineGamesTable } from "./OnlineGamesTable";

interface OnlineGamesLobbyProps {
    createGame: () => any;
    startGame: () => any;
    joinGame: (selectedGameId: number, playerName: string) => any;
    games: GamesMessage;
}

export function OnlineGamesLobby(props: OnlineGamesLobbyProps) {
    const [selectedGame, setSelectedGame] = React.useState<GamesMessageGame>();
    const [playerName, setPlayerName] = React.useState<string>("");
    const [hasJoinedGame, setHasJoinedGame] = React.useState<boolean>(false);
    
    const isJoinGameEnabled = () => {
        return selectedGame !== undefined 
            && selectedGame.players < 4
            && playerName.length > 0;
    }

    const joinGame = () => {
        if(selectedGame !== undefined){
            props.joinGame(selectedGame.id, playerName);
            setHasJoinedGame(true);
        }
    }

    const onGameSelected = (game: GamesMessageGame) => {
        if(!hasJoinedGame) setSelectedGame(game);
    }

    const hasJoinedGameStyle = () => {
        if(hasJoinedGame) return "joined";
        return "";
    }

    return <>
        <div className={`online-games-lobby left-pane ${hasJoinedGameStyle()}`}>
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
                    selectedGameId={selectedGame?.id}
                    onGameSelected={onGameSelected} />
            </div>
        </div>
        <div className="online-games-lobby right-pane">
            <div className="inner">
                <button className="btn-primary" data-new-online-game onClick={props.createGame}>New Online Game</button>
                <button className="btn-primary" data-join-game onClick={joinGame} disabled={!isJoinGameEnabled()}>Join Game</button>
                <div className="start-game-container">
                    <button className="btn-primary" data-start-game onClick={props.startGame}>Start Game</button>
                    <p>(with {4 - (selectedGame?.players ?? 0)} AI Players)</p>
                </div>
            </div>
        </div>
    </>
}