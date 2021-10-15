import React from 'react';
import renderer from 'react-test-renderer';
import {JsonEditor} from "../src/index";

test('1st test', ()=>{
    const component = renderer.create(
        <JsonEditor jsonInput={{"example": {
                "id": "json",
                "age": 99,
                "working": true,
                "problem": null,
                "more info": {
                    "car": {
                        "brand": "a-brand",
                        "year": 2020,
                        "owners": [
                            "father",
                            "brother"
                        ]
                    }
                }
            }
        }} onChange={(output) => {return output }} />
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
})