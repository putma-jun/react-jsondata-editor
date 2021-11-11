# react-jsondata-editor

<a href="https://www.npmjs.com/package/react-jsondata-editor"> <img alt="npm" src="https://img.shields.io/npm/v/react-jsondata-editor"></a>
<a href="https://www.npmjs.com/package/json-pointer"> <img alt="npm peer dependency version" src="https://img.shields.io/npm/dependency-version/react-jsondata-editor/peer/json-pointer"></a>
<a href="https://app.travis-ci.com/putma-jun/react-jsondata-editor"><img src="https://app.travis-ci.com/putma-jun/react-jsondata-editor.svg" alt="Build Status" /></a>


A JSON editor react library that displays and manipulates JSON String(object). 
It gets height and width from a parent's component frame size and fits the size. 
It supports string, number, null, boolean, object, and array types.

It was built by rollup and has 'cjs' and 'esm' two versions. The cjs version is around 48 KB and the esm version is around 43 KB. 


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
| jsonObject             | JSON String      | The initial value of a json String, it will be displayed on the view. The editor re-renders when the input of a Json string has been changed. It does not change the original input. 
| onChange               | callback function| It returns a stringify(JSON Object[output]) when the view of a Json object has been changed. It returns "undefined" when it has no data.
| theme                  | Object (optional)| Custom user theme(color and hoverColor). Example - themes: { color : '#9bb7d4', hoverColor : '#f4f7fa'}
| bannerStyle            | Object (optional)| Custom user banner style(hoverColor, fontColor and fontFamily). Example - banner: { hoverColor: '#6690bd', fontColor : 'white', fontFamily: 'Arial, Helvetica, sans-serif'}
| keyStyle               | Object (optional)| Custom user key style(color and fontFamily). Example - key : { color : 'black', fontFamily: 'Arial, Helvetica, sans-serif' }
| valueStyle             | Object (optional)| Custom user value style(fontFamily, nullColor, booleanColor, numberColor and stringColor). Example - values : { fontFamily: 'Arial, Helvetica, sans-serif', null : '#E9897E', boolean: '#8e4cad', number: '#25539a', string: '#797980' }
| buttonStyle            | Object (optional)| Custom user button style(add/edit, delete, update and cancel). Example - buttons: { add: '#9bb7d4', delete: '#a0a2a4', update: '#9BB7D4', cancel: '#d49bb7'}


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
