import { AIPlayer } from "../../src/ai-player/ai-player";
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

    it("Takes an action when it receives an update with a started game and the player ID matches", () => {
        new AIPlayer(fakeClient, 1);
        triggerUpdate(fakeClient, {
            currentPlayerId: 1,
            status: GameStatus.STARTED
        });

        expect(fakeClient.action).toHaveBeenCalled();
    });

    it("Takes no action when it receives an update and the player ID doesn't match", () => {
        new AIPlayer(fakeClient, 2);
        triggerUpdate(fakeClient, {
            currentPlayerId: 1,
            status: GameStatus.STARTED
        });

        expect(fakeClient.action).not.toHaveBeenCalled();
    });

    it("Takes no action when it receives an update and the game isnt STARTED", () => {
        new AIPlayer(fakeClient, 1);
        triggerUpdate(fakeClient, {
            currentPlayerId: 1,
            status: GameStatus.CREATED
        });

        expect(fakeClient.action).not.toHaveBeenCalled();
    })
});

function triggerUpdate(fakeClient: FakeClient, gameState: Partial<GameState>) {
    fakeClient.subscribe.calls.first().args[0](gameState);
}