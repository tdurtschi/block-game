import GamePiece from "./GamePiece";
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
            pieceId: idx
        }));
}

export default Player;