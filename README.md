* Pick up staged piece from board & fix cursor to pointer on staged piece
* Refactor - create StagedPiece type including target x,y coord.
* Played piece must touch same player's piece diagonally at least once.
* Played piece cannot touch same player's piece directly.
* Message for invalid move - client validation
    * _Maybe this one makes sense to split up into multiple stories, i.e. different behavior to discourage different invalid moves? Maybe that's overkill_
* Player can cancel move after staging.
* Player can cancel move by dropping back into inventory.
* Calculate & Display score at end of game.
* Full Game smoke test - happy path
* CSS Fixes
* Move server to backend with websockets.
* Page Object pattern for cypress
* Error goes away after some action/timer
