import GamePiece from "./GamePiece";
import PlayerId from "./PlayerId";

type PlayerState = {
    playerPieces: GamePiece[];
    hasPassed: boolean;
    playerId: PlayerId;
    score: number;
};

export default PlayerState;
