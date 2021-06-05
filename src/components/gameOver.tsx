import React = require("react");
import GameState from "../shared/types/GameState";
import PlayerState from "../shared/types/PlayerState";
import GameBoard from "./gameBoard";
import { NewGameButton } from "./newGameButton";

export interface GameOverProps {
    gameState: GameState;
    startGame: () => any;
}

export function GameOver({gameState, startGame}: GameOverProps) {
    return <>
        <div data-game-over className={`left-pane game-over`}>
            <div className={"inner"}>
                <h2>Game Over!</h2>
                <GameBoard
                    boardState={gameState.boardState}
                />
            </div>
        </div>
        <div className={`right-pane`}>
            <div className={"inner"}>
                {gameState.players.map((player, i) => (
                    <PlayerScore key={i} player={player} />
                ))}
                <h2>{winnerMessage(gameState)}</h2>
                <h2>Click here to start a new game:</h2>
                <div style={{ width: "16px" }} />
                <NewGameButton startGame={startGame} />
            </div>
        </div>
    </>
}

function PlayerScore({ player }: { player: PlayerState }) {
    return (
        <div className={`player-${player.playerId}-score`}>
            <h3>
                Player {player.playerId}:&nbsp;
                <span>{player.score}</span>
            </h3>
        </div>
    );
}

function winnerMessage(gameState: GameState) {
    const orderedPlayers = gameState.players.map((player) => ({
        playerId: player.playerId,
        score: player.score
    }));
    orderedPlayers.sort((a, b) =>
        a.score > b.score ? -1 : a.score === b.score ? 0 : 1
    );
    if (orderedPlayers[0].score === orderedPlayers[1].score) {
        return "Tie game";
    } else {
        return `Player ${orderedPlayers[0].playerId} wins!`;
    }
}