export default interface GamePiece {
    pieceData: number[][];
    id: number;
    rotate: 0 | 1 | 2 | 3;
    flip: boolean
}

export const GamePiecesData = [
    [		//0
        [1, 0],
        [1, 0],
        [1, 1],
        [0, 1]],

    [		//1
        [0, 1],
        [1, 1],
        [0, 1],
        [0, 1]],

    [		//2
        [1, 1, 0],
        [0, 1, 1],
        [0, 1, 0]],

    [		//3
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 1]],

    [		//4
        [1, 0, 0],
        [1, 0, 0],
        [1, 1, 1]],

    [		//5
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 1]],

    [		//6
        [1, 0, 1],
        [1, 1, 1]],

    [		//7
        [0, 1, 1],
        [0, 1, 0],
        [1, 1, 0]],

    [		//8
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 0]],

    [		//9
        [0, 1, 0],
        [1, 1, 1]],

    [		//10
        [0, 1],
        [1, 1],
        [1, 0]],

    [		//11
        [1, 0],
        [1, 1],
        [1, 1]],

    [		//12
        [1, 1],
        [1, 1]],

    [		//13
        [1, 0],
        [1, 0],
        [1, 0],
        [1, 1]],

    [		//14
        [1, 0],
        [1, 0],
        [1, 1]],

    [		//15
        [1, 0],
        [1, 1]],

    [		//16
        [1],
        [1],
        [1],
        [1],
        [1]],

    [		//17
        [1],
        [1],
        [1],
        [1]],

    [		//18
        [1],
        [1],
        [1]],

    [		//19
        [1],
        [1]],

    [		//20
        [1]]
];