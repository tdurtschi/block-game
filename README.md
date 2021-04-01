* Player can cancel move after staging.
* Player can cancel move by dropping back into inventory.
* Calculate & Display score at end of game.
* Full Game smoke test - happy path
* Error goes away after some action/timer
* Client side validation that piece fits on board - prevent exception
* Game ends if all non-passed players are out of pieces
** MVP! **
* CSS Fixes
* Move server to backend with websockets.
* Page Object pattern for cypress
* Fix cursor to pointer on staged piece hover.
* Message for invalid move - client validation
    * _Maybe this one makes sense to split up into multiple stories, i.e. different behavior to discourage different invalid moves? Maybe that's overkill_
* Keep track of mouse offset from top left to avoid jitter when first moving picked up piece.