import GameState from "../src/shared/types/GameState";
import GameStatus from "../src/shared/types/GameStatus";

export function CreateGameState(gameStatus: GameStatus){
    return {
        id: 1,
        currentPlayerId: 1,
        players: [{
            playerPieces: [],
            hasPassed: true,
            playerId: 1,
            name: "Player 1",
            score: 100
        },
        {
            playerPieces: [],
            hasPassed: true,
            playerId: 2,
            name: "Player 2",
            score: 200
        },
        {
            playerPieces: [],
            hasPassed: true,
            playerId: 3,
            name: "Player 3",
            score: 300
        },
        {
            playerPieces: [],
            hasPassed: true,
            playerId: 4,
            name: "Player 4",
            score: 400
        }],
        boardState: [],
        status: gameStatus
    } as GameState;
}