import Player from "../../src/shared/Player";
import PlayerId from "../../src/shared/types/PlayerId";

describe("Player", () => {
    it("Starts with 0 points", () => {
        const subject = new Player(2);
        expect(subject.getState().score).toEqual(0);
    });

    it("Scores a point for each tile in each piece played", () => {
        const subject = new Player(2);

        subject.playerPieces = [
            createPiece([[2, 2]]),
            createPiece([
                [2, 0],
                [2, 2]
            ])
        ];

        expect(subject.getState().score).toEqual(84);
    });
});

const createPiece = (data: number[][]) => ({
    id: 0,
    pieceData: data,
    rotate: 0 as 0 | 1 | 2 | 3,
    flip: false,
    playerId: 2 as PlayerId
});
