[<-- Back To Readme](./README.md)

# Product Backlog

-   Observability
    - See metrics on how many people use site
    - See metrics on Azure usage
-   Online: Handle an error when playing a move
-   Online: A player can only move when its their turn
-   Online: A player passes when their connection is closed
-   Online: Join game automatically on Create
-   Online: Handle connection error & reconnect
-   Refactor Buttons to be UI-component instead of unique component per button
-   Client validation: shouldn't be able to register player before creating new game.
-   Show if player has passed near score
-   ^^ **Next Release!** ^^
-   Refactor shared, server & UI source code heirarchy
-   Figure out why contributions dont show up
-   Improve logging/debug?
-   Figure out absolute paths for imports
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
-   Online: Create topic per game to eliminate subscribe step.

- R to rotate, F to flip
- Auto pass when player is done
- Sounds, i.e. alert when it's your turn
- sometimes it rotates one too many times (?? on a laptop)
- View help from in-game
- Reconnect on connection fail
- Can view my own pieces when its not my turn