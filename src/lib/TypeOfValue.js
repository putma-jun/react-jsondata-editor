import React from 'react';

/**
 * Turns primitive types into string.
 *
 * @param input
 * @returns {string}
 */
export default function TypeOfValue(input) {

    if (input === undefined)
        return "undefined"
    else if (input === null)
        return "null"
    else if (typeof input == "boolean")
        return "boolean"
    else if (typeof input == "number")
        return "number"
    else if (typeof input == "string")
        return "string"
    else if (input instanceof Array)
        return "array"
    else
        return "object"

}

