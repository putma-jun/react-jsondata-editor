import React from 'react';
import renderer from "react-test-renderer";
import {JsonEditor} from "../src";

test('undefined test', ()=>{

    const component = renderer.create(
        <JsonEditor jsonObject={undefined} onChange={(output) => {return output }} />
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    let component2 = renderer.create(
        <JsonEditor onChange={(output) => {return output }} />
    );

    let tree2 = component2.toJSON();
    expect(JSON.stringify(tree)).toEqual(JSON.stringify(tree2))

    component2 = renderer.create(
        <JsonEditor jsonObject={{}} onChange={(output) => {return output }} />
    );

    tree2 = component2.toJSON();
    expect(JSON.stringify(tree)).not.toBe(JSON.stringify(tree2))
});

test('null test', ()=>{
    // Checks null type is okay
    const component = renderer.create(
        <JsonEditor jsonObject={null} onChange={(output) => {return output }} />
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();


    // Checks with other types
    let component2 = renderer.create(
        <JsonEditor jsonObject={"null"} onChange={(output) => {return output }} />
    );

    let tree2 = component2.toJSON();
    expect(JSON.stringify(tree)).not.toBe(JSON.stringify(tree2))

    component2 = renderer.create(
        <JsonEditor onChange={(output) => {return output }} />
    );

    tree2 = component2.toJSON();
    expect(JSON.stringify(tree)).not.toBe(JSON.stringify(tree2))

});


test('boolean true test', ()=>{
    const component = renderer.create(
        <JsonEditor jsonObject={true} onChange={(output) => {return output }} />
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    let component2 = renderer.create(
        <JsonEditor jsonObject={false} onChange={(output) => {return output }} />
    );

    let tree2 = component2.toJSON();
    expect(JSON.stringify(tree)).not.toBe(JSON.stringify(tree2))
});

test('boolean false test', ()=>{
    const component = renderer.create(
        <JsonEditor jsonObject={false} onChange={(output) => {return output }} />
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    let component2 = renderer.create(
        <JsonEditor jsonObject={true} onChange={(output) => {return output }} />
    );

    let tree2 = component2.toJSON();
    expect(JSON.stringify(tree)).not.toBe(JSON.stringify(tree2))
});

test('number test', ()=>{
    const component = renderer.create(
        <JsonEditor jsonObject={564608} onChange={(output) => {return output }} />
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    let component2 = renderer.create(
        <JsonEditor jsonObject={"564608"} onChange={(output) => {return output }} />
    );

    let tree2 = component2.toJSON();
    expect(JSON.stringify(tree)).not.toBe(JSON.stringify(tree2))

    const component3 = renderer.create(
        <JsonEditor jsonObject={-564608.23} onChange={(output) => {return output }} />
    );

    let tree3 = component3.toJSON();
    expect(tree3).toMatchSnapshot();
});

test('string test', ()=>{
    const component = renderer.create(
        <JsonEditor jsonObject={"string test"} onChange={(output) => {return output }} />
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

});


test('array test', ()=>{
    const component = renderer.create(
        <JsonEditor jsonObject={[null, false, true, 1007, "test"]} onChange={(output) => {return output }} />
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test('object test', ()=>{
    const component = renderer.create(
        <JsonEditor jsonObject={
            {
                "example": {
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
            }
        }
            onChange={(output) => {return output }} />
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});