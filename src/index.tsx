import { useState } from "react";
import React = require("react");
import ReactDOM = require("react-dom");

function blockGame() {
  const [message, setMessage] = useState<string>("Block Game");

  return (
    <div>
      <div>{message}</div>
      <button data-new-game onClick={() => setMessage("Hello!")}>New Game</button>
      </div>
  )
};

const container = document.createElement('div');
document.body.appendChild(container);

ReactDOM.render(
  React.createElement(blockGame),
  container
);
