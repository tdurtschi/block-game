import GameStatus from "../shared/types/GameStatus";

export type GamesMessageGame = {
    id: number;
    players: number;
    status: GameStatus;
}

export type GamesMessage = GamesMessageGame[];