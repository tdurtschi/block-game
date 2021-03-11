import { flip, rotate, rotateReverse } from "../../src/shared/pieceUtils"

const testPiece = [
    [1, 0],
    [1, 0],
    [1, 1],
    [0, 1]
];

describe("rotate", () => {
    it("rotates the piece counterclockwise", () => {
        const result = rotate(testPiece);
        expect(result).toEqual([
            [0, 0, 1, 1],
            [1, 1, 1, 0]
        ]);
    });

    it("reverses a rotation", () => {
        const result = rotateReverse(testPiece);
        expect(result).toEqual([
            [0, 1, 1, 1],
            [1, 1, 0, 0]
        ]);
    });
});

describe("flip", () => {
    it("flips the piece", () => {
        const result = flip(testPiece);
        expect(result).toEqual([
            [0, 1],
            [0, 1],
            [1, 1],
            [1, 0]
        ]);
    });
});