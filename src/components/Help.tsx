import { useState } from "react";
import React = require("react");
import ReactMarkdown = require("react-markdown");

const helpMarkdown = `
# Rules

The goal of Block Game is to play as many of your pieces (tiles) as possible. A player gets one point for each square of a tile played (For example, the 1x1 tile is worth 1 point, and the 5x1 tile is worth 5 points)

On a player's turn, a player can either play a tile or pass. You can't play again after passing, so be sure you're out of moves.

The rules for playing a tile are:

* The first tile must touch one of the board's corners.
* Two tiles can't overlap.
* Two of the player's tiles CANNOT touch each other ADJACENTLY. 
* Two of the player's tiles MUST touch each other DIAGONALLY, at least once.

The game ends when every player has either passed or played all their tiles.

# Gameplay
To play a tile, click on it to pick it up, and place it on the gameboard.

**Rotate** a tile by using the scroll wheel while the piece is 'picked up'.

**Flip** a tile by right clicking while the piece is 'picked up'.
`;

export const HelpContent = ({ onHide }: { onHide: () => any }) => (
    <div className={"help-container"}>
        <div className={"help-content"}>
            <ReactMarkdown children={helpMarkdown} />
            <button className="btn-primary" onClick={onHide}>Ok</button>
        </div>
    </div>
)


export const HelpButton = () => {
    const [isShowingHelp, setIsShowingHelp] = useState<boolean>(false);
    const onClick = () => {
        setIsShowingHelp(true);
    };

    return (<>
        {isShowingHelp && <HelpContent onHide={() => setIsShowingHelp(false)} />}
        <a href="#" className="help-button" data-help-button onClick={onClick}>
            Learn How To Play
    </a>
    </>
    )
};