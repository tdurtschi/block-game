[<-- Back To Readme](./README.md)

# Product Backlog

-   Warning/Message on Mobile device
-   Confirm Pass
-   Helper text for flip/rotate while piece is active
-   View all pieces while game is in progress
-   ^^ **Next Release!** ^^
-   Move server to backend with websockets. (See below)
-   Fix warnings during CI/CD/Testing
-   Player can cancel move by dropping back into inventory.
-   Active/Staged piece doesn't appear in player's inventory.
-   CSS Fixes
-   Page Object pattern for cypress
-   Fix cursor to pointer on staged piece hover.
-   Incorporate feedback mechanism
-   AI player - naive
-   View other players' pieces when it's not their turn
-   Message for invalid move - client validation
    -   _Maybe this one makes sense to split up into multiple stories, i.e. different behavior to discourage different invalid moves? Maybe that's overkill_

## Server backlog (Draft)

-   User can select "Local" game or "Online"
-   Feature flag for "Online" mode
-   If 4 players select "Online" mode, the game starts. No player access controls.
-   Online players can't do actions on another player's turn.
-   8 players can start 2 games.
-   Remove feature flag
-   Security (???)
-   ^^ **MVP!** ^^
-   Player can create a nickname before playing online game.
-   Private games

## Server backlog (Draft 2)

-   User can enter custom player names before starting local game
-   User can select "Local" game or "Online"
-   Feature flag for "Online" mode
-   User can enter one player's info before starting online game
-   Once 4 players enter player info and click start, game starts.
-   Online players can't do actions on another player's turn.
-   8 players can start 2 games.
-   Remove feature flag
-   Security (???)
-   ^^ **MVP!** ^^
-   Private games

## Server backlog (Draft 3)

-   User can enter custom player names before starting local game
-   Tech chore: Register each player as 4 events to game. New Game status for registration state.
-   AI that can complete a simple game by passing.
    -   Subtasks: Before starting local game, select Human/AI for each player.
    -   Notes: Is the AI just another client, managed by the UI?
-   User can select Online or Local mode (Same behavior).
-   4 Different browsers can connect to one Online game.
