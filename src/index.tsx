import React = require("react");
import ReactDOM = require("react-dom");
import App from "./components/App";
import GameClient from "./game/gameClient";
import GameServer from "./server";

const container = document.createElement('div');
container.className = "app-container";
document.body.appendChild(container);

const gameClient = new GameClient(new GameServer());

ReactDOM.render(
  React.createElement(App, { gameClient }),
  container
);
