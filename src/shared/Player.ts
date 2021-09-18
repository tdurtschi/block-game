import GamePiece, { GamePiecesData } from "./types/GamePiece";
import PlayerId from "./types/PlayerId";
import PlayerState from "./types/PlayerState";

const NUM_PIECES = GamePiecesData.length;
const TOTAL_TILES = 89;

class Player {
    public playerPieces: GamePiece[];
    public hasPassed: boolean = false;

    constructor(public playerId: PlayerId, public name: string = "Unknown") {
        this.playerPieces = this.pieces();
    }

    public pass() {
        this.hasPassed = true;
    }

    public isOutOfPieces() {
        return this.playerPieces.length === 0;
    }

    public getState(): PlayerState {
        return {
            playerId: this.playerId,
            name: this.name,
            playerPieces: this.playerPieces,
            hasPassed: this.hasPassed,
            score: this.score()
        };
    }

    private pieces = () =>
        new Array(NUM_PIECES).fill(0).map((_, idx) => ({
            playerId: this.playerId,
            id: idx,
            pieceData: GamePiecesData[idx],
            rotate: 0 as 0 | 1 | 2 | 3,
            flip: false
        }));

    private score = () => {
        const pieceSubtotal = (piece: GamePiece): number =>
            piece.pieceData.reduce(
                (subtotal, pieceRow) =>
                    pieceRow.filter((tile) => tile !== 0).length + subtotal,
                0
            );

        return (
            TOTAL_TILES -
            this.playerPieces.reduce((previous: number, current: GamePiece) => {
                const pieceTotal = pieceSubtotal(current);
                return previous + pieceTotal;
            }, 0)
        );
    };

    isFirstTurn() {
        return this.playerPieces.length === NUM_PIECES;
    }
}

export default Player;
