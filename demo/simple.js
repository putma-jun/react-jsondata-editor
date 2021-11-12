import React from "react";
import {JsonEditor} from "../src/index";

export default function Simple() {
    let input =
        '{"example":{"id":"json","age":99,"working":true,"problem":null,"more info":{"car":{"brand":"a-brand","year":2020,"owners":["father","brother"]}}}}'

    return (
        <div style={{ height : "500px",  width: "500px", border: "solid 1px #dddddd"}}>
            <JsonEditor jsonObject={input} onChange={(output)=>{console.log(output)}}/>
        </div>
    )
}
