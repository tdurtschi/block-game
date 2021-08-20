import React = require("react");

export const ConfirmButton = ({ action, label }: { action: () => void; label?: string; }) => (
    <button className="btn-primary" data-confirm-action onClick={action}>
        {label ? label : "Confirm"}
    </button>
);
