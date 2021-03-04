import GamePiece from "./GamePiece";

class Player {
    public playerPieces: GamePiece[];

    constructor(
        public playerId: 1 | 2 | 3 | 4,

    ) {
        this.playerPieces = this.pieces();
    }

    private pieces = () =>
        new Array(21).fill(0).map((_, idx) => ({
            pieceId: idx
        }));
}

export default Player;