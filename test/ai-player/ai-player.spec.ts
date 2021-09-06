import { AIPlayer } from "../../src/ai-player/ai-player";
import Game from "../../src/server/Game";
import GameState from "../../src/shared/types/GameState";
import GameStatus from "../../src/shared/types/GameStatus";

interface FakeClient {
    action: jasmine.Spy,
    registerPlayer: jasmine.Spy,
    startGame: jasmine.Spy,
    newGame: jasmine.Spy,
    subscribe: jasmine.Spy
};

describe('AI Player', () => {
    let fakeClient: FakeClient;

    beforeEach(() => {
        fakeClient = {
            action: jasmine.createSpy(),
            registerPlayer: jasmine.createSpy(),
            startGame: jasmine.createSpy(),
            newGame: jasmine.createSpy(),
            subscribe: jasmine.createSpy()
        };
    })

    describe('First turn', () => {
        it("Plays the first piece in an available corner", () => {
            new AIPlayer(fakeClient, 1);
            triggerUpdate(fakeClient, getGameStateFirstTurn());

            expect(fakeClient.action).toHaveBeenCalled();
            const actionTaken = fakeClient.action.calls.first().args[0];

            expect(actionTaken.kind).toEqual("GamePlay");
            expect(actionTaken.playerId).toEqual(1);
            expect(actionTaken.location).toEqual({x: 0, y: 0});

            // todo fix this test make it better
        })
    });

    it("Takes an action when it receives an update with a started game and the player ID matches", () => {
        new AIPlayer(fakeClient, 1);
        triggerUpdate(fakeClient, getGameStateFirstTurn());

        expect(fakeClient.action).toHaveBeenCalled();
    });

    it("Takes no action when it receives an update and the player ID doesn't match", () => {
        new AIPlayer(fakeClient, 2);
        triggerUpdate(fakeClient, getGameStateFirstTurn());

        expect(fakeClient.action).not.toHaveBeenCalled();
    });

    it("Takes no action when it receives an update and the game isnt STARTED", () => {
        new AIPlayer(fakeClient, 1);
        triggerUpdate(fakeClient, getGameStateUnstarted());

        expect(fakeClient.action).not.toHaveBeenCalled();
    });
});

function triggerUpdate(fakeClient: FakeClient, gameState: Partial<GameState>) {
    fakeClient.subscribe.calls.first().args[0](gameState);
}

function getGameStateUnstarted(): Partial<GameState> {
    const game = new Game(0);
    game.registerPlayer("p1");
    game.registerPlayer("p2");
    game.registerPlayer("p3");
    game.registerPlayer("p4");

    return game.getState();
}

function getGameStateFirstTurn(): Partial<GameState> {
    const game = new Game(0);
    game.registerPlayer("p1");
    game.registerPlayer("p2");
    game.registerPlayer("p3");
    game.registerPlayer("p4");
    game.start();

    return game.getState();
}
