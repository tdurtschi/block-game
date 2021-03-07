import React = require("react");
import ReactDOM = require("react-dom");
import { act } from 'react-dom/test-utils';
import GamePiece from "../src/types/GamePiece";
import GamePieces from '../src/components/gamePieces';

let container: HTMLDivElement;

// for more info https://reactjs.org/docs/test-utils.html

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container!);
});

describe("Game Pieces", () => {
  it("Shows one piece for each input", () => {
    const gamePieces: GamePiece[] = [
      {
        pieceId: 0
      },
      {
        pieceId: 1
      },
      {
        pieceId: 2
      }
    ]

    act(() => {
      ReactDOM.render(<GamePieces playerId={1} gamePieces={gamePieces} />, container);
    });
    const pieces = container.querySelectorAll('[data-game-piece]');
    expect(pieces.length).toBe(3);
  })
})