[<-- Back To Readme](./README.md)

# Product Backlog

-   Versioning
-   ^^ **Next Release!** ^^
-   Fix warnings during CI/CD/Testing
-   Fix big array in gameContainer.tsx
-   QA pipeline / ship-it script
-   Player can cancel move by dropping back into inventory.
-   Confirm Pass
-   Build, serve, & run cypress script
-   View gameboard end state after game over
-   View all scores while game is in progress
-   Move server to backend with websockets. (See below)
-   CSS Fixes
-   Page Object pattern for cypress
-   Fix cursor to pointer on staged piece hover.
-   Message for invalid move - client validation
    -   _Maybe this one makes sense to split up into multiple stories, i.e. different behavior to discourage different invalid moves? Maybe that's overkill_
-   Keep track of mouse offset from top left to avoid jitter when first moving picked up piece.
-   Incorporate feedback mechanism
-   AI player - naive
-   View other players' pieces when it's not their turn

## Server backlog (Draft)

-   User can select "Local" game or "Online"
-   Feature flag for "Online" mode
-   If 4 players select "Online" mode, the game starts. No player access controls.
-   Online players can't do actions on another player's turn.
-   8 players can start 2 games.
-   Remove feature flag
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
-   ^^ **MVP!** ^^
-   Private games
