import React = require("react");
import { IGameClient } from "../game-client";
import { PlayerConfig } from "../game-client/playerConfig";
import Action from "../shared/types/Actions";
import GameState from "../shared/types/GameState";
import GameStatus from "../shared/types/GameStatus";
import GameContainer from "./game/gameContainer";
import { GameOver } from "./GameOver";
import { RegisterPlayers } from "./newGame/registerPlayers";

interface LocalGameProps {
    gameClient: IGameClient;
    setError: (error: any) => any;
}

export function LocalGame({ gameClient, setError }: LocalGameProps) {
    const [gameState, setGameState] = React.useState<GameState>();

    const createNewLocalGame = () => {
        const initialGameState = gameClient.newGame();
        setGameState(initialGameState);
        gameClient.subscribe((gameState) => setGameState(gameState));
    };

    React.useEffect(() => {
        createNewLocalGame();
    }, []);

    if (!gameState) { return <></>; }

    const submitAction = (action: Action) => {
        const result = gameClient.action(action);

        if (result.errorMessage) {
            setError(result.errorMessage);
        }
        return result;
    };

    const onPlayersRegistered = (playerConfig: PlayerConfig[]) => {
        gameClient.registerPlayer(playerConfig[0]);
        gameClient.registerPlayer(playerConfig[1]);
        gameClient.registerPlayer(playerConfig[2]);
        gameClient.registerPlayer(playerConfig[3]);
        gameClient.startGame();
    }

    return <>{gameState.status === GameStatus.STARTED && (
        <GameContainer
            gameState={gameState}
            action={submitAction}
        />
    )}
        {gameState.status === GameStatus.CREATED && (
            <RegisterPlayers onPlayersRegistered={onPlayersRegistered} />
        )}
        {gameState.status === GameStatus.OVER && (
            <GameOver gameState={gameState} startGame={createNewLocalGame} />
        )}</>
}