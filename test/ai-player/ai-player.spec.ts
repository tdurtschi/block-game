import { AIPlayer } from "../../src/ai-player/ai-player";
import GameClient from "../../src/local-game/gameClient";
import LocalGameServer from "../../src/local-game/localGameServer";
import Game from "../../src/shared/Game";
import GameState from "../../src/shared/types/GameState";
import GameStatus from "../../src/shared/types/GameStatus";
import { testGameFixture } from "../../test/testGameFixture";

interface FakeClient {
    action: jasmine.Spy;
    registerPlayer: jasmine.Spy;
    startGame: jasmine.Spy;
    newGame: jasmine.Spy;
    subscribe: jasmine.Spy;
}

describe("AI Player", () => {
    let fakeClient: FakeClient;

    beforeEach(() => {
        fakeClient = {
            action: jasmine.createSpy(),
            registerPlayer: jasmine.createSpy(),
            startGame: jasmine.createSpy(),
            newGame: jasmine.createSpy(),
            subscribe: jasmine.createSpy()
        };
    });

    describe("First turn", () => {
        it("Plays the first piece in an available corner", (done) => {
            const client = new GameClient(new LocalGameServer());
            client.newGame();
            client.registerPlayer({ name: "p1", isAI: true });
            client.registerPlayer({ name: "p2", isAI: true });
            client.registerPlayer({ name: "p3", isAI: true });
            client.registerPlayer({ name: "p4", isAI: true });

            let isFirstTurn = true;
            client.subscribe((gameState) => {
                if (
                    isFirstTurn &&
                    gameState.status == GameStatus.STARTED &&
                    gameState.currentPlayerId === 1
                ) {
                    isFirstTurn = false;
                    return;
                }

                if (!isFirstTurn && gameState.currentPlayerId === 1) {
                    expect(gameState.boardState[0][0]).not.toBeUndefined();
                    expect(
                        gameState.boardState[gameState.boardState.length - 1][0]
                    ).not.toBeUndefined();
                    expect(
                        gameState.boardState[0][
                            gameState.boardState[0].length - 1
                        ]
                    ).not.toBeUndefined();
                    expect(
                        gameState.boardState[gameState.boardState.length - 1][
                            gameState.boardState[0].length - 1
                        ]
                    ).not.toBeUndefined();

                    done();
                }
            });

            client.startGame();
        });
    });

    it("Takes an action when it receives an update with a started game and the player ID matches", () => {
        new AIPlayer(fakeClient, 1);
        triggerUpdate(fakeClient, getGameStateFirstTurn());

        expect(fakeClient.action).toHaveBeenCalledTimes(1);
    });

    it("Takes only one action when multiple are possible", () => {
        new AIPlayer(fakeClient, 1);
        triggerUpdate(fakeClient, getGameStateSecondTurn());

        expect(fakeClient.action).toHaveBeenCalledTimes(1);
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

function getGameStateSecondTurn(): Partial<GameState> {
    const game = new Game(0);
    game.registerPlayer("p1");
    game.registerPlayer("p2");
    game.registerPlayer("p3");
    game.registerPlayer("p4");
    game.start();
    testGameFixture.slice(0, 4).forEach(action => game.action(action));

    return game.getState();
}