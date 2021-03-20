import BoardState from "./BoardState";
import GameStatus from "./GameStatus";
import PlayerId from "./PlayerId";

type GameState = {
    id: number,
    boardState: Readonly<BoardState>,
    currentPlayer: Readonly<PlayerId>,
    players: Readonly<PlayerState[]>,
    status: GameStatus
}

export default GameState;