import { MoveValidations } from "../shared/moveValidations";
import { applyPieceModifications } from "../shared/pieceUtils";
import Action, { BoardLocation, GamePlayAction } from "../shared/types/Actions";
import BoardState from "../shared/types/BoardState";
import GamePiece from "../shared/types/GamePiece";
import GameState from "../shared/types/GameState";
import GameStatus from "../shared/types/GameStatus";
import PlayerId from "../shared/types/PlayerId";

interface AIGameClient {
    subscribe: (onUpdate: (gameState: Readonly<GameState>) => any) => any;
    action: (action: Action) => any;
}

export class AIPlayer {
    constructor(private gameClient: AIGameClient, private playerId: PlayerId) {
        gameClient.subscribe(this.onUpdate.bind(this));
    }

    private onUpdate(gameState: Readonly<GameState>) {
        if (
            gameState.status !== GameStatus.STARTED ||
            gameState.currentPlayerId !== this.playerId
        ) {
            return;
        }

        if (this.isFirstTurn(gameState, this.playerId)) {
            const move = this.getFirstMove(gameState);
            this.gameClient.action({
                kind: "GamePlay",
                playerId: this.playerId,
                piece: move.pieceId,
                location: move.location,
                rotate: 0,
                flip: false
            });

            return;
        } else {
            const validOpenCells: BoardLocation[] = this.getValidOpenCells(
                gameState.boardState
            );

            for (let i = 0; i < validOpenCells.length; i++) {
                try {
                    const cell = validOpenCells[i];
                    const action = this.getValidActionOrError(gameState, cell);
                    this.gameClient.action(action);
                    return;
                } catch (error) {
                    // Silently continue without finding valid move.
                }
            }

            this.gameClient.action({
                kind: "Pass",
                playerId: this.playerId
            });
        }
    }

    getValidActionOrError(
        gameState: GameState,
        cell: BoardLocation
    ): GamePlayAction {
        const shuffledPieces = shuffle(
            this.getPlayerPieces(gameState, this.playerId)
        );

        for (let i = 0; i < shuffledPieces.length; i++) {
            const piece = shuffledPieces[i];

            const validLocationToPlay = this.getValidLocationToPlay(
                piece,
                cell,
                gameState.boardState
            );

            if (validLocationToPlay) {
                return {
                    kind: "GamePlay",
                    playerId: this.playerId,
                    piece: piece.id,
                    location: validLocationToPlay.location,
                    rotate: validLocationToPlay.rotate,
                    flip: validLocationToPlay.flip
                };
            }
        }

        throw new Error("Unable to find valid move");
    }

    getValidLocationToPlay(
        piece: any,
        cell: BoardLocation,
        boardState: Readonly<BoardState>
    ) {
        const permutationsToTry = generatePermutations(piece.pieceData, cell);

        const validPermutation = permutationsToTry.find((move: Move) =>
            this.isValidMove(move, piece.id, boardState)
        );

        if (validPermutation) {
            return validPermutation;
        }
    }

    private getValidOpenCells(boardState: readonly (PlayerId | undefined)[][]) {
        const validOpenCells = [];

        const isCellOpen = (location: BoardLocation) =>
            boardState[location.y][location.x] === undefined;

        const isCellValid = (location: BoardLocation) => {
            return (
                MoveValidations.cellDoesntTouchPlayedPieceAdjacently(
                    boardState,
                    location,
                    this.playerId
                ) &&
                MoveValidations.cellTouchesPlayedPieceDiagonally(
                    boardState,
                    location,
                    this.playerId
                )
            );
        };

        for (let y = 0; y < boardState.length; y++) {
            for (let x = 0; x < boardState[y].length; x++) {
                if (isCellOpen({ x, y }) && isCellValid({ x, y })) {
                    validOpenCells.push({ x, y });
                }
            }
        }

        return shuffle(validOpenCells);
    }

    private isFirstTurn(gameState: GameState, playerId: PlayerId) {
        const playerPieces = this.getPlayerPieces(gameState, playerId);

        return MoveValidations.isFirstTurn(playerPieces);
    }

    private isValidMove(
        move: Move,
        pieceId: number,
        boardState: Readonly<BoardState>
    ) {
        const action: GamePlayAction = {
            kind: "GamePlay",
            playerId: this.playerId,
            piece: pieceId,
            location: move.location,
            rotate: move.rotate,
            flip: move.flip
        };

        try {
            MoveValidations.validateGamePlayAction(boardState, action, false);
            return true;
        } catch (error) {
            return false;
        }
    }

    private getFirstMove(gameState: GameState) {
        const playerPieces = this.getPlayerPieces(gameState, this.playerId);
        const { boardState } = gameState;

        if (boardState[0][0] === undefined) {
            const piece = this.getRandomPieceWithCondition(
                playerPieces,
                (piece) => piece.pieceData[0][0] !== 0
            )!;
            return { pieceId: piece.id, location: { x: 0, y: 0 }, rotate: 0 };
        } else if (boardState[0][boardState[0].length - 1] === undefined) {
            const piece = this.getRandomPieceWithCondition(
                playerPieces,
                (piece) =>
                    piece.pieceData[0][piece.pieceData[0].length - 1] !== 0
            )!;
            const xLocation = boardState[0].length - piece.pieceData[0].length;

            return {
                pieceId: piece.id,
                location: { x: xLocation, y: 0 },
                rotate: 0
            };
        } else if (boardState[boardState.length - 1][0] === undefined) {
            const piece = this.getRandomPieceWithCondition(
                playerPieces,
                (piece) => piece.pieceData[piece.pieceData.length - 1][0] !== 0
            )!;
            const yLocation = boardState.length - piece.pieceData.length;

            return {
                pieceId: piece.id,
                location: { x: 0, y: yLocation },
                rotate: 0
            };
        } else {
            const piece = this.getRandomPieceWithCondition(
                playerPieces,
                (piece) =>
                    piece.pieceData[piece.pieceData.length - 1][
                        piece.pieceData[0].length - 1
                    ] !== 0
            )!;
            const xLocation = boardState[0].length - piece.pieceData[0].length;
            const yLocation = boardState.length - piece.pieceData.length;

            return {
                pieceId: piece.id,
                location: { x: xLocation, y: yLocation },
                rotate: 0
            };
        }
    }

    private getRandomPieceWithCondition(
        playerPieces: GamePiece[],
        condition: (piece: GamePiece) => boolean
    ): GamePiece | undefined {
        const shuffledPieces = shuffle(playerPieces);
        let piece = shuffledPieces.find((piece) => condition(piece));
        return piece;
    }

    private getPlayerPieces(gameState: GameState, playerId: PlayerId) {
        return gameState.players.find((player) => player.playerId === playerId)
            ?.playerPieces!;
    }
}

function shuffle(array: any[]) {
    var m = array.length,
        t,
        i;

    // While there remain elements to shuffle…
    while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }

    return array;
}

function generatePermutations(pieceData: number[][], cell: BoardLocation) {
    const rotations: (0 | 1 | 2 | 3)[] = [0, 1, 2, 3];
    const flipsAndRotations = flatMap(rotations, (rotate) => [
        { rotate, flip: true },
        { rotate, flip: false }
    ]);
    const allPermutations = flatMap(flipsAndRotations, ({ flip, rotate }) => {
        const transformedPiece = applyPieceModifications(
            pieceData,
            rotate,
            flip
        );

        const xCoordsToTry = transformedPiece[0].map(
            (_, index) => cell.x - index
        );
        const yCoordsToTry = transformedPiece.map((_, index) => cell.y - index);

        const locations = flatMap(xCoordsToTry, (x) =>
            yCoordsToTry.map((y) => ({ x, y }))
        );

        return locations.map((location) => ({
            rotate,
            flip,
            location
        }));
    });

    return shuffle(allPermutations);
}

function flatMap<T, U>(array: T[], mapFunc: (x: T) => U[]) : U[] {
    return array.reduce((cumulus: U[], next: T) => [...mapFunc(next), ...cumulus], <U[]> []);
}

interface Move {
    rotate: 0 | 1 | 2 | 3;
    flip: boolean;
    location: BoardLocation;
}
