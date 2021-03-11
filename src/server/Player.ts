import GamePiece, { GamePiecesData } from "../shared/types/GamePiece";
import PlayerId from "./PlayerId";

class Player {
    public playerPieces: GamePiece[];
    public hasPassed: boolean = false;

    constructor(
        public playerId: PlayerId,

    ) {
        this.playerPieces = this.pieces();
    }

    public pass() {
        this.hasPassed = true;
    }

    private pieces = () =>
        new Array(21).fill(0).map((_, idx) => ({
            id: idx,
            pieceData: GamePiecesData[idx]
        }));
}

export default Player;