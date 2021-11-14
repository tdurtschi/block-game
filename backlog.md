[<-- Back To Readme](./README.md)

# Product Backlog

-   Back Buttons (local player register page)
-   Client validation: shouldn't be able to register player before creating new game.
-   Checkmark -> Radio button for AI / human players
-   Show if player has passed near score
-   ^^ **Next Release!** ^^
-   Figure out absolute paths for imports
-   Figure out why contributions dont show up
-   Improve logging/debug?
-   Helper text for flip/rotate while piece is active
-   View all pieces while game is in progress
-   Move server to backend with websockets. (See below)
-   Fix warnings during CI/CD/Testing
-   Player can cancel move by dropping back into inventory.
-   Active/Staged piece doesn't appear in player's inventory.
-   Page Object pattern for cypress
-   Fix cursor to pointer on staged piece hover.
-   Incorporate feedback mechanism
-   View other players' pieces when it's not their turn
-   Message for invalid move - client validation
    -   _Maybe this one makes sense to split up into multiple stories, i.e. different behavior to discourage different invalid moves? Maybe that's overkill_
-   No Duplicate Names

## Server backlog

-   Enforce correct behavior on lobby screen (name first, then join/create, then start game)
    - No hover on game list after joined game
    - Join game automatically on Create
    - Can't create game with blank name
    - Only show "with _ AIs" if _ > 0.
    - Can't join game if joined game already.
-   Security: Maximum concurrent games (100?)

## MVP??? 

-   Handle a connection error (blank screen) / show something while connecting
-   Handle an error when playing a move
-   A player can only move when its their turn
-   Fix test flakiness for server spec
-   Create topic per game to eliminate subscribe step.
