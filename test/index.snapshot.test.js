import React from 'react';
import {create, act} from "react-test-renderer";
import {JsonEditor} from "../src/index";

test('undefined test', () =>{
    let component;
    let component2;

    act(() => {
        component = create( <JsonEditor />)
    });

    expect(component.toJSON()).toMatchSnapshot();

    act(() => {
        component2 = create( <JsonEditor jsonObject={JSON.stringify({})}/>);
    })
    expect(component2.toJSON()).toMatchSnapshot();
    expect(component2.toJSON()).not.toBe(component.toJSON())
});


test('null test', () =>{
    let component;
    let component2;

    act(() => {
        component = create( <JsonEditor jsonObject={JSON.stringify(null)}/>)
    });

    expect(component.toJSON()).toMatchSnapshot();

    act(() => {
        component2 = create( <JsonEditor/>);
    })
    expect(component2.toJSON()).not.toBe((component.toJSON()));

});

test('boolean test', () =>{
    let component;
    let component2;

    act(() => {
        component = create( <JsonEditor jsonObject={JSON.stringify(true)}/>)
    });

    expect(component.toJSON()).toMatchSnapshot();

    act(() => {
        component2 = create( <JsonEditor jsonObject={JSON.stringify(false)}/>);
    })
    expect(component2.toJSON()).toMatchSnapshot();
    expect(component2.toJSON()).not.toBe((component.toJSON()));

});

test('number test', () =>{
    let component;
    let component2;

    act(() => {
        component = create( <JsonEditor jsonObject={JSON.stringify(564608)}/>)
    });

    expect(component.toJSON()).toMatchSnapshot();

    act(() => {
        component2 = create( <JsonEditor jsonObject={JSON.stringify("564608")}/>);
    })
    expect(component2.toJSON()).toMatchSnapshot();
    expect(component2.toJSON()).not.toBe((component.toJSON()));


    act(() => {
        component2.update( <JsonEditor jsonObject={JSON.stringify(564608.02)}/>);
    })

    expect(component2.toJSON()).not.toBe((component.toJSON()))

    act(() => {
        component2.update( <JsonEditor jsonObject={JSON.stringify(-564608)}/>);
    })

});

test('string test', () =>{
    let component;
    let component2;

    act(() => {
        component = create( <JsonEditor jsonObject={JSON.stringify("test")}/>)
    });

    expect(component.toJSON()).toMatchSnapshot();

    act(() => {
        component2 = create( <JsonEditor jsonObject={"test"}/>);
    })
    expect(component2.toJSON()).toMatchSnapshot();
    expect(component2.toJSON()).not.toBe((component.toJSON()));

});


test('array test', () =>{
    let component;
    let component2;

    act(() => {
        component = create( <JsonEditor jsonObject={JSON.stringify([null, false, true, 1007, "test"])}/>)
    });

    expect(component.toJSON()).toMatchSnapshot();

    act(() => {
        component2 = create( <JsonEditor jsonObject={JSON.stringify(  [{0: null }, {1:false}, {2:true}, {3:1007}, {4:"test"} ])}/>);
    })
    expect(component2.toJSON()).toMatchSnapshot();
    expect(JSON.stringify(component2.toJSON())).not.toBe(JSON.stringify(component.toJSON()));

});


test('object test', () =>{
    let component;

    act(() => {
        component = create( <JsonEditor jsonObject={JSON.stringify(    {
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
        })}/>)
    });

    expect(component.toJSON()).toMatchSnapshot();

});