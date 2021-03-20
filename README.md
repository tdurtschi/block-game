* New game button is in game board - goes away after starting.
* Bug rotate->flip->rotate->confirm
* Pick up staged piece from board & fix cursor to pointer on staged piece
* Message for invalid move - server validation
* Message for invalid move - client validation
* Player must make first move at corner.
* Played piece cannot extend past the edges of the board.
* Played piece must touch same player's piece diagonally at least once.
* Played piece cannot touch same player's piece directly.
* Player can cancel move after staging.
* Player can cancel move by dropping back into inventory.
* Calculate & Display score at end of game.
* Full Game smoke test - happy path
* CSS Fixes
* Move server to backend with websockets.
* Debounce mouse wheel for rotation