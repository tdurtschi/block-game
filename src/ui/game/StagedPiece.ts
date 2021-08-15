import { BoardLocation } from "../../shared/types/Actions";
import GamePiece from "../../shared/types/GamePiece";

interface IStagedPiece {
    target: BoardLocation;
}

type StagedPiece = GamePiece & IStagedPiece;

export default StagedPiece;
