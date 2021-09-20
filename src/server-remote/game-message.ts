import Action from "../shared/types/Actions";

export type GameMessage =
    | {
          kind: "SUBSCRIBE";
          id: number;
      }
    | {
          kind: "REGISTER";
          id: number;
          playerName: string;
      }
    | {
          kind: "START";
          id: number;
      }
    | {
          kind: "ACTION";
          id: number;
          action: Action;
      };
