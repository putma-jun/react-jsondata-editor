# react-jsondata-editor

<a href="https://www.npmjs.com/package/react-jsondata-editor"> <img alt="npm" src="https://img.shields.io/npm/v/react-jsondata-editor"></a>
<a href="https://github.com/putma-jun/react-jsondata-editor/actions/workflows/node.js.yml"><img alt="build status" src="https://github.com/putma-jun/react-jsondata-editor/actions/workflows/node.js.yml/badge.svg"></a>





A JSON editor react library that displays and manipulates JSON String(object). 
It gets height and width from a parent's component frame size and fits the size. 
It supports string, number, null, boolean, object, and array types.


It was built by rollup and has 'cjs' and 'esm' two versions. 
The cjs version is around 46 KB and the esm version is around 42 KB. 

---
It was built with <a href="https://www.npmjs.com/package/json-pointer">json-pointer</a> v0.6.1

Version ^2.0.0 : input/output are JSON string now, users can change css style with props 

# Installation

```
$ npm i react-jsondata-editor
```

# Demo
- simple demo->
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
| bannerStyle            | Object (optional)| Custom user banner style(hoverColor, fontColor and font). Example - banner: { hoverColor: '#6690bd', fontColor : 'white', font: '20px/30px "Times New Roman", Times, serif'}
| keyStyle               | Object (optional)| Custom user key style(color and font). Example - key : { color : 'black', font: '14px/20px "Times New Roman", Times, serif'}
| valueStyle             | Object (optional)| Custom user value style(font, nullColor, booleanColor, numberColor and stringColor). Example - values : { font: '14px/20px Arial, Helvetica, sans-serif',, null : '#E9897E', boolean: '#8e4cad', number: '#25539a', string: '#797980' }
| buttonStyle            | Object (optional)| Custom user button style(add/edit, delete, update and cancel). Example - buttons: { add: '#9bb7d4', delete: '#a0a2a4', update: '#9BB7D4', cancel: '#d49bb7'}


# Simple
```javascript
import React from "react";
import {JsonEditor} from "react-jsondata-editor";

export default function Simple() {
  let input =
          '{"example":{"id":"json","age":99,"working":true,"problem":null,"more info":{"car":{"brand":"a-brand","year":2020,"owners":["father","brother"]}}}}'

  return (
          <div style={{ height : "500px",  width: "500px", border: "solid 1px #dddddd"}}>
            <JsonEditor jsonObject={input} onChange={(output)=>{console.log(output)}}/>
          </div>
  )
}


```

# Text area and JSON editor
```javascript
import {useEffect, useState} from "react";
import {JsonEditor} from "../public/index";


import styles from '../styles/Index.module.css'


export default function Home() {
    let currentEditObj ;
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

    const myStyle = {
      theme: {
        color : '#00A170',
        hoverColor : '#f7f7f7'
      },
      bannerStyle: {
        hoverColor: '#006e4d',
        fontColor : 'white',
        font: '20px/30px "Times New Roman", Times, serif'
  
      },
      keyStyle : {
        color : 'black',
        font: '14px/20px "Times New Roman", Times, serif'
      },
      valueStyle : {
        font: '14px/20px Arial, Helvetica, sans-serif',
        null : '#939597',
        boolean: '#939597',
        number: '#939597',
        string: '#939597'
      },
      buttonStyle: {
        add: '#006e4d',
        delete: '#939597',
        update: '#006e4d',
        cancel: '#bb0039',
      }
    }

  const [jsonInput, setJsonInput] = useState(JSON.stringify(input, null, ' '))
  
  function textSave(e) {
    setJsonInput(e.target.value)
  }

  function saveJsonString() {

    if(currentEditObj === undefined){
      setJsonInput('')
    }else{
      setJsonInput(currentEditObj)
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
                  <div style={{textAlign:"center"}}>
                    <button type={"button"} onClick={saveJsonString}><span><i className={styles.arrowLeft}/>String</span></button>
                  </div>
                </div>

                <div className={styles.output} >
                  <div className={styles.jsonContainer}>
                    <div style={{height:"100%", border: "1px solid lightgray", borderRadius: "6px", backgroundColor: "white"}}>
                      <JsonEditor jsonObject={jsonInput} onChange={(output) => { currentEditObj = output }}
                                  theme={myStyle.theme} bannerStyle={myStyle.bannerStyle} keyStyle={myStyle.keyStyle} valueStyle={myStyle.valueStyle} buttonStyle={myStyle.buttonStyle}
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
  )
}



```

# License

[MIT](LICENSE.md)
