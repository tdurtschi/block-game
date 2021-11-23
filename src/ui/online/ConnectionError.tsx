import React = require("react");

interface ConnectionErrorProps {

}


export function ConnectionError({ }: ConnectionErrorProps) {
    return <>
        <div data-game-over className={`left-pane game-over`}>
            <div className="inner">
                <h2>Connection error 😭</h2>
            </div>
        </div>
    </>;
}