import React from 'react';

/**
 * Turns primitive values into string.
 *
 * @param input
 * @returns {JSX.Element}
 *
 */
export default function ValueToString({input}) {

    let toStringValue

    if (input == null)
        toStringValue = "null"
    else if (typeof input == "boolean")
        toStringValue = input ? "true" : "false"
    else
        toStringValue = input

    return (
        <span>{toStringValue}</span>
    )
}

