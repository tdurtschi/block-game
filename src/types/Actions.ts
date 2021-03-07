import PlayerId from "../server/PlayerId";

type Action = GamePlayAction | PassAction;

export type GamePlayAction = {
    kind: "GamePlay",
    playerId: PlayerId,
    piece: number,
    location: BoardLocation
}

export type PassAction = {
    kind: "Pass",
    playerId: PlayerId,
}

export interface BoardLocation {
    x: number;
    y: number;
}

export default Action;