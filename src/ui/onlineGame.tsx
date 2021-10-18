import React = require("react");
import { GamesMessage, IOnlineGamesClient } from "../server-remote/gamesClient";
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
        const selectedGameId = games[0].id;
        gamesClient.joinGame(selectedGameId, playerName);
    }

    const startGame = () => {
        const selectedGameId = games[0].id;
        gamesClient.startGame(selectedGameId);
    }

    const onGamesUpdate = (data: GamesMessage) => {
        setGames(data);
    }

    const onGameUpdate = (data: GameState) => {
        console.log(data);
        setGameState(data);
    }

    return <>
        {connectionState === ConnectionState.CONNECTED && <>
            <div className="left-pane">
                <div className="inner">
                    <h2>Online Games Lobby</h2>
                    <div className="online-game-list">
                        <table className="" data-games-list>
                            <thead>
                                <tr>
                                    <th>Game ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {games.map((game) => <tr key={game.id}>
                                    <td>{game.id}</td>
                                </tr>)}
                            </tbody>
                        </table>
                    </div>
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

export default OnlineGame;