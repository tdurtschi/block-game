import React = require("react");
import { GamesMessage } from "../server-remote/games-message";
import { IOnlineGamesClient } from "../server-remote/gamesClient";
import Action from "../shared/types/Actions";
import GameState from "../shared/types/GameState";
import GameStatus from "../shared/types/GameStatus";
import GameContainer from "./game/gameContainer";
import { OnlineGamesLobby } from "./OnlineGamesLobby";

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

    const joinGame = (selectedGameId: number, playerName: string) => {
        gamesClient.joinGame(selectedGameId, playerName);
    }

    const startGame = () => {
        if (gameState !== undefined) {
            gamesClient.startGame(gameState.id);
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
    
    const onGameAction = (action: Action) => {
        gamesClient.gameAction(action);
        return {};
    }

    return <>
        {connectionState === ConnectionState.CONNECTED &&
            gameState?.status !== GameStatus.STARTED &&
            <OnlineGamesLobby
                joinGame={joinGame}
                createGame={createGame}
                startGame={startGame}
                games={games}
            />}
        {gameState?.status === GameStatus.STARTED && <GameContainer
            gameState={gameState}
            action={onGameAction}
        />}
    </>
}

export default OnlineGame;