import React = require("react");
import { IOnlineGamesClient } from "../../../src/server-remote/gamesClient";
import OnlineGameContainer from "../../../src/ui/online/OnlineGameContainer";
import { render, waitFor } from "@testing-library/react";
import { fakeOnlineClient } from "../../fakes";

describe('Online Games Container', () => {
    it("Shows error message on connection reject", async () => {
        const onlineGameClient: IOnlineGamesClient = fakeOnlineClient({
            connect: () => new Promise((_, reject) => {
                reject();
            })
        })

        render(<OnlineGameContainer goHome={jest.fn()} gamesClient={onlineGameClient} />)

        await waitFor(() => {
            expect(document.body.textContent).toContain("Connection error");
        })
    });

    it("Shows connecting message while pending", async () => {
        const onlineGameClient: IOnlineGamesClient = fakeOnlineClient({
            connect: () => new Promise((_, __) => { })
        });

        render(<OnlineGameContainer goHome={jest.fn()} gamesClient={onlineGameClient} />)

        await waitFor(() => {
            expect(document.body.textContent).toContain("Connecting");
        })
    });
});