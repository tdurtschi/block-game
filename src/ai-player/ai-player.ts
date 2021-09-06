import { IGameClient } from "../game-client";
import { MoveValidations } from "../shared/moveValidations";
import { BoardLocation, GamePlayAction } from "../shared/types/Actions";
import GamePiece from "../shared/types/GamePiece";
import GameState from "../shared/types/GameState";
import GameStatus from "../shared/types/GameStatus";
import PlayerId from "../shared/types/PlayerId";

export class AIPlayer {
    constructor(private gameClient: IGameClient, private playerId: PlayerId) {
        gameClient.subscribe(this.onUpdate.bind(this));
    }

    private onUpdate(gameState: Readonly<GameState>) {
        if (
            gameState.status !== GameStatus.STARTED ||
            gameState.currentPlayerId !== this.playerId
        )
            return;

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
                    const action = this.getValidMoveAtCell(gameState, cell);
                    this.gameClient.action(action);
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

    getValidMoveAtCell(
        gameState: GameState,
        cell: BoardLocation
    ): GamePlayAction {
        const piece = this.getRandomPieceWithCondition(
            this.getPlayerPieces(gameState, this.playerId),
            (piece) => {
                const action: GamePlayAction = {
                    kind: "GamePlay",
                    playerId: this.playerId,
                    piece: piece.id,
                    location: cell,
                    rotate: 0 as 0, // 😭 Sad TS Compiler
                    flip: false
                };

                try {
                    MoveValidations.validateGamePlayAction(
                        gameState.boardState,
                        action,
                        false
                    );
                    return true;
                } catch (error) {
                    return false;
                }
            }
        );

        return {
            kind: "GamePlay",
            playerId: this.playerId,
            piece: piece.id,
            location: cell,
            rotate: 0 as 0, // 😭 Sad TS Compiler
            flip: false
        };
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

        return validOpenCells;
    }

    private isFirstTurn(gameState: GameState, playerId: PlayerId) {
        const playerPieces = this.getPlayerPieces(gameState, playerId);

        return MoveValidations.isFirstTurn(playerPieces);
    }

    private getFirstMove(gameState: GameState) {
        const playerPieces = this.getPlayerPieces(gameState, this.playerId);
        const { boardState } = gameState;

        if (boardState[0][0] === undefined) {
            const piece = this.getRandomPieceWithCondition(
                playerPieces,
                (piece) => piece.pieceData[0][0] !== 0
            );
            return { pieceId: piece.id, location: { x: 0, y: 0 }, rotate: 0 };
        } else if (boardState[0][boardState[0].length - 1] === undefined) {
            const piece = this.getRandomPieceWithCondition(
                playerPieces,
                (piece) =>
                    piece.pieceData[0][piece.pieceData[0].length - 1] !== 0
            );
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
            );
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
            );
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
    ) {
        let piece: GamePiece;
        let attempts = 0;
        do {
            const pieceId = Math.floor(
                Math.random() * (playerPieces.length - 1)
            );
            piece = playerPieces[pieceId];
            attempts++;
        } while (!condition(piece) && attempts < 1000);

        return piece;
    }

    private getPlayerPieces(gameState: GameState, playerId: PlayerId) {
        return gameState.players.find((player) => player.playerId === playerId)
            ?.playerPieces!;
    }
}