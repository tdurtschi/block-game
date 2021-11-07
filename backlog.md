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

-   Show final score for Online Multiplayer
-   Improve styling for online lobby.
-   What happens when the game is over? Delete it from the list, close connections etc.

## MVP??? 

-   Fix test flakiness for server spec
-   A player can only move when its their turn
-   Prompt user to create 4-(players) dummy/AI players when starting game
-   Handle an error when playing a move
-   Connection error handling (no blank screen)
-   Create topic per game to eliminate subscribe step.
