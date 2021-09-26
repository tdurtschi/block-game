import React = require("react");
import ReactDOM = require("react-dom");
import App from "./ui/App";
import GameClient from "./game-client";
import GameServer from "./server-local";
import { OnlineGamesClient } from "./server-remote/gamesClient";

const container = document.createElement("div");
container.className = "app-container";
document.body.appendChild(container);

const props = {
    gameClient: new GameClient(new GameServer()),
    onlineGameClient: new OnlineGamesClient(),
};

ReactDOM.render(React.createElement(App, props), container);
