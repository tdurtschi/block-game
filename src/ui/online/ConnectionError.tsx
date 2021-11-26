import React = require("react");

interface ConnectionErrorProps {
    goBack: () => any;
}


export function ConnectionError({ goBack }: ConnectionErrorProps) {
    return <>
        <div data-game-over className={`left-pane game-over`}>
            <div className="inner">
                <h2>Connection error 😭</h2>
                <button className="btn-secondary"
                    onClick={goBack}>
                        Go Back
                </button>
            </div>
        </div>
    </>;
}