import React = require("react");
import ReactDOM = require("react-dom");
import App from "./ui/App";
import GameClient from "./frontend/gameClient";
import GameServer from "./server";

const container = document.createElement("div");
container.className = "app-container";
document.body.appendChild(container);

const props = {
    gameClient: new GameClient(new GameServer())
};

ReactDOM.render(React.createElement(App, props), container);
