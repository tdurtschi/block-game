import React = require("react");
import ReactDOM = require("react-dom");
import App from "./ui/App";
import GameClient from "./local-game/gameClient";
import LocalGameServer from "./local-game/localGameServer";
import { OnlineGamesClient } from "./server-remote/gamesClient";

const container = document.createElement("div");
container.className = "app-container";
document.body.appendChild(container);

const props = {
    gameClient: new GameClient(new LocalGameServer()),
    onlineGameClient: new OnlineGamesClient(),
};

ReactDOM.render(React.createElement(App, props), container);
