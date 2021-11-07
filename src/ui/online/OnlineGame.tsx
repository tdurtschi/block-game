import React = require("react");
import { GamesMessage } from "../../server-remote/games-message";
import Action from "../../shared/types/Actions";
import GameState from "../../shared/types/GameState"
import GameStatus from "../../shared/types/GameStatus"
import GameContainer from "../game/gameContainer";
import { GameOver } from "../GameOver";
import { OnlineGamesLobby } from "./OnlineGamesLobby";

export interface OnlineGameProps {
    gameState: GameState | undefined;
    games: GamesMessage;
    createGame: () => any;
    startGame: () => any;
    joinGame: (selectedGameId: number, playerName: string) => any;
    action: (action: Action) => { errorMessage?: string };
    goHome: () => any;
}

export function OnlineGame({ 
    gameState,
    games,
    createGame,
    startGame,
    joinGame,
    action,
    goHome
}: OnlineGameProps) {
    switch(gameState?.status) {
        case GameStatus.STARTED:
            return <GameContainer
            gameState={gameState}
            action={action}
            />;
        case GameStatus.OVER:
            return <GameOver gameState={gameState} startGame={goHome}/>
        default:
            return <OnlineGamesLobby
            joinGame={joinGame}
            createGame={createGame}
            startGame={startGame}
            games={games}
            />;
    }
}