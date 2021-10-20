# react-jsondata-editor

<a href="https://www.npmjs.com/package/react-jsondata-editor"> <img alt="npm" src="https://img.shields.io/npm/v/react-jsondata-editor"></a>
<a href="https://www.npmjs.com/package/json-pointer"> <img alt="npm peer dependency version" src="https://img.shields.io/npm/dependency-version/react-jsondata-editor/peer/json-pointer"></a>
<a href="https://app.travis-ci.com/putma-jun/react-jsondata-editor"><img src="https://app.travis-ci.com/putma-jun/react-jsondata-editor.svg" alt="Build Status" /></a>


A JSON editor react library that displays and manipulates JSON objects. 
It gets height and width from a parent's component frame size and fits the size. 
It supports string, number, null, boolean, object, and array types.


# Installation

```
$ npm i react-jsondata-editor
```

# Demo
- Simple demo ->
  [Demo](https://json-editor-demo-pib6.vercel.app/demo)
- Text area and JSON editor ->
  [Demo](https://json-editor-demo-pib6.vercel.app/)


# Usage

```
import {JsonEditor} from "react-jsondata-editor"

<JsonEditor jsonObject={input} onChange={(output)=> {console.log(output)}} />
```

# Props

| Prop                   | Type             | Description                                                                                                                                                                                                                                                          |
| ---------------------- | ---------------- | -------------------------------------|
| jsonObject             | JSON Object      | The initial value of an input json object, it will be displayed on the view. The editor re-renders when the input of a Json object has been changed. It does not change the original input. 
| onChange               | callback function| It returns a JSON Object(output) when the view of a Json object has been changed. It returns "undefined" when it has no data. 


# Simple
```javascript
import React from "react";
import {JsonEditor} from "react-jsondata-editor";

export default function demo() {
    let input =
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

    return (
        <div style={{ height : "500px",  width: "500px"}}>
            <JsonEditor jsonObject={input} onChange={(output)=>{console.log(output)}}/>
        </div>
    )
}

```

# Text area and JSON editor
```javascript
import React, {useState} from "react";
import {JsonEditor} from "../src/index";
import * as styles from './Index.module.css';

export default function Home() {
  let input =
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


  let currentEditObj ;

  const [jsonInput, setJsonInput] = useState(JSON.stringify(input, null, ' '))

  function textSave(e) {
    setJsonInput(e.target.value)
  }

  function ToJson(input){
    try {
      return JSON.parse(input)
    } catch {
      return undefined
    }

  }

  function saveJsonString() {

    if(currentEditObj === undefined){
      setJsonInput('')
    }else{
      setJsonInput(JSON.stringify(currentEditObj, null, ' '))
    }
  }

  return (
          <div className={styles.screenContainer}>
            <div className={styles.mainContainer}>
              <div className={styles.topContainer}>
                <span> Json Editor (Demo) </span>
              </div>

              <div className={styles.viwContainer}>
                <div className={styles.jsonContainer}>
                  <textarea value={jsonInput} onChange={textSave}/>
                </div>

                <div className={styles.middleContainer}>
                  <div style={{textAlign: "center"}}>
                    <button type={"button"} onClick={saveJsonString}><span><i className={styles.arrowLeft}/> String</span>
                    </button>
                  </div>
                </div>

                <div className={styles.output}>
                  <JsonEditor jsonObject={ ToJson(jsonInput) } onChange={(output) => {
                    currentEditObj = output
                  }}/>
                </div>
              </div>

            </div>
          </div>
  )
}


```

# License

[MIT](LICENSE.md)
