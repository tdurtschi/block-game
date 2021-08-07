[<-- Back To Readme](./README.md)

# Product Backlog

-   Confirm Pass
-   View all scores/pieces while game is in progress
-   Versioning (show version/attribution on page somewhere?)
-   Fix buggy error show/hide behavior
-   ^^ **Next Release!** ^^
-   Move server to backend with websockets. (See below)
-   Fix warnings during CI/CD/Testing
-   Player can cancel move by dropping back into inventory.
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
