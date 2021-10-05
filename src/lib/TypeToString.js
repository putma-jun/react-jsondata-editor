import React from 'react';
import TypeOfValue from "./TypeOfValue";

export default function TypeToString({input}) {

    return (
        <span>{TypeOfValue(input)}</span>
    )
}

