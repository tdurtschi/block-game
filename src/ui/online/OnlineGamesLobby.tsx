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
    const [selectedGameId, setSelectedGameId] = React.useState<number>();
    const [playerName, setPlayerName] = React.useState<string>("");
    const [hasJoinedGame, setHasJoinedGame] = React.useState<boolean>(false);
    
    const createGame = () => {
        props.createGame()
    };

    const isJoinGameEnabled = () => {
        const game = selectedGame();
        return game !== undefined 
            && game.players < 4
            && playerName.length > 0
            && !hasJoinedGame;
    }

    const isCreateGameEnabled = () => {
        return playerName.length > 0
            && hasJoinedGame == false;
    }

    const joinGame = () => {
        if(selectedGameId !== undefined){
            props.joinGame(selectedGameId, playerName);
            // TODO move this up a level, shouldn't hold this state here:
            setHasJoinedGame(true);
        }
    }

    const onGameSelected = (game: GamesMessageGame) => {
        if(!hasJoinedGame) setSelectedGameId(game.id);
    }

    const hasJoinedGameStyle = () => {
        if(hasJoinedGame) return "joined";
        return "";
    }

    const selectedGame = () => {
        return props.games.find(game => game.id == selectedGameId);
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
                    selectedGameId={selectedGameId}
                    onGameSelected={onGameSelected} />
            </div>
        </div>
        <div className="online-games-lobby right-pane">
            <div className="inner">
                {hasJoinedGame
                    ? <div className="start-game-container">
                        <h3>You're in Game {selectedGame()?.id ?? "GAME_ID_ERROR"}</h3>
                        <h4>Start now with {4 - (selectedGame()?.players ?? 0)} AI Players!</h4>
                        <button className="btn-primary" data-start-game 
                            onClick={props.startGame} 
                            disabled={!hasJoinedGame}>
                                Start Game
                        </button>
                    </div>
                    : <>
                        <button className="btn-primary" data-new-online-game 
                            onClick={createGame} 
                            disabled={!isCreateGameEnabled()}>
                                New Online Game
                        </button>
                        <button className="btn-primary" data-join-game 
                            onClick={joinGame} 
                            disabled={!isJoinGameEnabled()}>
                                Join Game
                        </button>
                    </>
                }
            </div>
        </div>
    </>
}