import { useState } from "react";
import React = require("react");

export interface ErrorState {
    errorDisplayTime?: number;
    errorText: string;
    clearError: () => any;
}

export function Error(errorState: ErrorState) {
    const [displayError, setDisplayError] = useState<boolean>(false);
    const [errorDisplayTimeout, setErrorDisplayTimeout] = useState<NodeJS.Timeout | undefined>(undefined);

    React.useEffect(() => {
        setDisplayError(true);
        errorDisplayTimeout && clearTimeout(errorDisplayTimeout);
        setErrorDisplayTimeout(setTimeout(() => {
            setDisplayError(false);
            errorState.clearError();
        }, errorState.errorDisplayTime || 6000));
    }, [errorState.errorText]);

    return (
        (displayError && errorState.errorText && (
            <div className={`error-message-container`}>
                Error: {errorState.errorText}
            </div>
        )) || <></>
    );
}
