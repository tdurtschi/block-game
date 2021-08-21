import BoardState from "./BoardState";
import GameStatus from "./GameStatus";
import PlayerId from "./PlayerId";
import PlayerState from "./PlayerState";

type GameState = {
    id: number;
    boardState: Readonly<BoardState>;
    currentPlayerId: Readonly<PlayerId>;
    players: Readonly<PlayerState[]>;
    status: GameStatus;
};

export default GameState;
