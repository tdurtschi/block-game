import GamePiece, { GamePiecesData } from "../shared/types/GamePiece";
import PlayerId from "../shared/types/PlayerId";
import PlayerState from "../shared/types/PlayerState";

const NUM_PIECES = 21;
const TOTAL_TILES = 89;

class Player {
  public playerPieces: GamePiece[];
  public hasPassed: boolean = false;

  constructor(public playerId: PlayerId) {
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
      playerPieces: this.playerPieces,
      hasPassed: this.hasPassed,
      score: this.score(),
    };
  }

  private pieces = () =>
    new Array(NUM_PIECES).fill(0).map((_, idx) => ({
      playerId: this.playerId,
      id: idx,
      pieceData: GamePiecesData[idx],
      rotate: 0 as 0 | 1 | 2 | 3,
      flip: false,
    }));

  private score = () => {
    const pieceSubtotal = (piece: GamePiece): number =>
      piece.pieceData.reduce(
        (subtotal, pieceRow) =>
          pieceRow.filter((tile) => tile !== 0).length + subtotal,
        0
      );

    return TOTAL_TILES - this.playerPieces.reduce((previous: number, current: GamePiece) => {
      const pieceTotal = pieceSubtotal(current);
      return previous + pieceTotal;
    }, 0);
  };

  isFirstTurn() {
    return this.playerPieces.length === NUM_PIECES;
  }
}

export default Player;
