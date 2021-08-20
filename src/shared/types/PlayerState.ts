import GamePiece from "./GamePiece";
import PlayerId from "./PlayerId";

type PlayerState = {
    playerId: PlayerId;
    name: string;
    playerPieces: GamePiece[];
    hasPassed: boolean;
    score: number;
};

export default PlayerState;
