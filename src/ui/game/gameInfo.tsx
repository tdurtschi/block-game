import React = require("react");
import GameState from "../../shared/types/GameState";

export function GameInfo({ gameState }: { gameState: GameState }) {
    return (<div className={`game-info`}>
        <div>Current Scores:</div>
        {gameState.players.map(player => (<div className={`player-stat`} key={player.playerId}>
            <span>{`Player ${player.playerId}`}</span>&nbsp;-&nbsp;
            <span data-testid={`player-${player.playerId}-score`}>{player.score}</span>
        </div>))}
    </div>)
}
