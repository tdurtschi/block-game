import { IGameClient } from "../game-client";
import { BoardLocation } from "../shared/types/Actions";
import GamePiece, { GamePiecesData } from "../shared/types/GamePiece";
import GameState from "../shared/types/GameState";
import GameStatus from "../shared/types/GameStatus";
import PlayerId from "../shared/types/PlayerId";

const TOTAL_NUMBER_OF_PIECES = GamePiecesData.length

export class AIPlayer {
    constructor(private gameClient: IGameClient, 
        private playerId: PlayerId) {
        gameClient.subscribe(this.onUpdate.bind(this));
    }
    
    private onUpdate(gameState: Readonly<GameState>) {
        if(gameState.status !== GameStatus.STARTED || gameState.currentPlayerId !== this.playerId) return;
        
        if(this.isFirstTurn(gameState)) {
            const move = this.getFirstMove(gameState);
            this.gameClient.action({
                kind: "GamePlay",
                playerId: this.playerId,
                piece: move.pieceId,
                location: move.location,
                rotate: 0,
                flip: false
            })

            return;
        }

        const validOpenSpaces = this.getValidOpenSpaces(gameState.boardState);

        this.gameClient.action({
            kind: "Pass",
            playerId: this.playerId
        });
    }

    private getValidOpenSpaces(boardState: readonly (PlayerId | undefined)[][]) {
        const validOpenSpaces = [];
        const isSpaceOpen = (location: BoardLocation) => boardState[location.y][location.x] === undefined;
        const isSpaceValid = (location: BoardLocation) => {
            if(location.x > 0 && boardState[location.y][location.x-1] === this.playerId){
                return false;
            }
            if(location.y > 0 && boardState[location.y-1][location.x] === this.playerId){
                return false;
            }
            if(location.x < (boardState[0].length - 1) && boardState[location.y][location.x+1] === this.playerId){
                return false;
            }
            if(location.y < (boardState.length - 1) && boardState[location.y+1][location.x] === this.playerId){
                return false;
            }

            return this.cellTouchesPlayedPieceDiagonally(boardState, location);
        }

        for(let y = 0; y < boardState.length; y++) {
            for(let x = 0; x <  boardState[y].length; x++) {
                if(isSpaceOpen({x, y}) && isSpaceValid({x, y})){
                    validOpenSpaces.push({x, y});
                }
            }
        }

        return validOpenSpaces;
    }

    private isFirstTurn(gameState: GameState) {
        const playerPieces = gameState.players.find(player => player.playerId === this.playerId)?.playerPieces;
        if(playerPieces && playerPieces.length === TOTAL_NUMBER_OF_PIECES) {
            return true;
        } else {
            return false;
        }
    }

    private getFirstMove({boardState, players}: GameState) {
        const playerPieces = players.find(p => p.playerId === this.playerId)!.playerPieces;

        if(boardState[0][0] === undefined) {
            const piece = this.getRandomPieceWithCondition(playerPieces, (piece) => piece.pieceData[0][0] !== 0);
            return {pieceId: piece.id, location: {x: 0, y: 0}, rotate: 0};
        } else if(boardState[0][boardState[0].length - 1] === undefined) {
            const piece = this.getRandomPieceWithCondition(playerPieces, (piece) => piece.pieceData[0][piece.pieceData[0].length - 1] !== 0);
            const xLocation = boardState[0].length - piece.pieceData[0].length;

            return {pieceId: piece.id, location: {x: xLocation, y: 0}, rotate: 0};
        } else if(boardState[boardState.length - 1][0] === undefined) {
            const piece = this.getRandomPieceWithCondition(playerPieces, (piece) => piece.pieceData[piece.pieceData.length - 1][0] !== 0);
            const yLocation = boardState.length - piece.pieceData.length;

            return {pieceId: piece.id, location: {x: 0, y: yLocation}, rotate: 0};
        } else {
            const piece = this.getRandomPieceWithCondition(playerPieces, (piece) => piece.pieceData[piece.pieceData.length - 1][piece.pieceData[0].length - 1] !== 0);
            const xLocation = boardState[0].length - piece.pieceData[0].length;
            const yLocation = boardState.length - piece.pieceData.length;

            return {pieceId: piece.id, location: {x: xLocation, y: yLocation}, rotate: 0};
        }
    }

    private getRandomPieceWithCondition(playerPieces: GamePiece[], condition: (piece: GamePiece) => boolean) {
        let piece: GamePiece;
        do{
            const pieceId = Math.floor(Math.random()*(playerPieces.length-1));
            piece = playerPieces[pieceId];
        } while(!(condition(piece)));

        return piece;
    }

    private cellTouchesPlayedPieceDiagonally(boardState: readonly (PlayerId | undefined)[][], location: BoardLocation) {
        return (
            location.y + 1 < boardState.length &&
            location.x + 1 < boardState[0].length &&
            boardState[location.y + 1][location.x + 1] ==
                this.playerId) ||
            (location.y + 1 < boardState.length &&
                location.x > 0 &&
                boardState[location.y + 1][location.x - 1] ==
                    this.playerId) ||
            (location.y > 0 &&
                location.x + 1 < boardState[0].length &&
                boardState[location.y - 1][location.x + 1] ==
                    this.playerId) ||
            (location.y > 0 &&
                location.x > 0 &&
                boardState[location.y - 1][location.x - 1] ==
                    this.playerId);
    }
}

