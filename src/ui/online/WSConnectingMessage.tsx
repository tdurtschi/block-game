import React = require("react");

interface WSConnectingMessageProps {

}


export function WSConnectingMessage({ }: WSConnectingMessageProps) {
    return <>
        <div data-game-over className={`left-pane game-over`}>
            <div className="inner">
                <h2>Connecting to server...</h2>
            </div>
        </div>
    </>;
}