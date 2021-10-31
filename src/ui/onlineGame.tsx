import React = require("react");
import { GamesMessage } from "../server-remote/games-message";
import { IOnlineGamesClient } from "../server-remote/gamesClient";
import Game from "../shared/Game";
import GameState from "../shared/types/GameState";
import GameStatus from "../shared/types/GameStatus";
import GameContainer from "./game/gameContainer";

interface OnlineGameProps {
    gamesClient: IOnlineGamesClient;
}

enum ConnectionState {
    CONNECTING,
    CONNECTED,
    ERROR
}

export function OnlineGame({ gamesClient }: OnlineGameProps) {
    const [connectionState, setConnectionState] = React.useState<ConnectionState>(ConnectionState.CONNECTING);
    const [games, setGames] = React.useState<GamesMessage>([]);
    const [gameState, setGameState] = React.useState<GameState>();
    const [playerName, setPlayerName] = React.useState<string>("");
    const [selectedGameId, setSelectedGameId] = React.useState<number>();

    React.useEffect(() => {
        const connect = async () => {
            gamesClient.connect(onGamesUpdate, onGameUpdate)
                .then(() => {
                    setConnectionState(ConnectionState.CONNECTED)
                })
                .catch(() => {
                    setConnectionState(ConnectionState.ERROR);
                });
        }

        connect();
    }, []);

    const createGame = () => {
        gamesClient.createGame();
    };

    const joinGame = () => {
        if(selectedGameId !== undefined){
            gamesClient.joinGame(selectedGameId, playerName);
        }
    }

    const startGame = () => {
        if(selectedGameId !== undefined){
            gamesClient.startGame(selectedGameId);
        }
    }

    const onGamesUpdate = (data: GamesMessage) => {
        console.log(data);
        setGames(data);
    }

    const onGameUpdate = (data: GameState) => {
        console.log(data);
        setGameState(data);
    }

    const onGameSelected = (id: number) => {
        setSelectedGameId(id);
    }

    return <>
        {connectionState === ConnectionState.CONNECTED &&
            gameState?.status !== GameStatus.STARTED && <>
                <div className="left-pane">
                    <div className="inner">
                        <h2>Online Games Lobby</h2>
                        <OnlineGamesTable
                            games={games}
                            selectedGameId={selectedGameId}
                            onGameSelected={onGameSelected} />
                        <button className="btn-primary" data-new-online-game onClick={createGame}>New Online Game</button>
                    </div>
                </div>
                <div className="right-pane">
                    <div className="inner">
                        <label htmlFor="player-name">Name:</label>
                        <input data-player-name id="player-name" value={playerName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlayerName(e.target.value)} />
                        <button className="btn-primary" data-join-game onClick={joinGame}>Join Game</button>
                        <button className="btn-primary" data-start-game onClick={startGame}>Start Game</button>
                    </div>
                </div>
            </>}
        {gameState?.status === GameStatus.STARTED && <GameContainer
            gameState={gameState}
            action={() => { }}
        />}
    </>
}

interface OnlineGamesTableProps {
    games: GamesMessage;
    onGameSelected: (id: number) => any;
    selectedGameId: number | undefined;
}

function OnlineGamesTable(props: OnlineGamesTableProps) {
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

export default OnlineGame;