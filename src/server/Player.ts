import GamePiece, { GamePiecesData } from "../shared/types/GamePiece";
import PlayerId from "../shared/types/PlayerId";

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

    public getState() {
        return {
            playerId: this.playerId,
            playerPieces: this.playerPieces,
            hasPassed: this.hasPassed,
        }
    }

    private pieces = () =>
        new Array(21).fill(0).map((_, idx) => ({
            id: idx,
            pieceData: GamePiecesData[idx],
            rotate: 0 as 0 | 1 | 2 | 3,
            flip: false
        }));
}

export default Player;