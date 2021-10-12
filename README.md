# react-jsondata-editor

<a href="https://www.npmjs.com/package/react-jsondata-editor"> <img alt="npm" src="https://img.shields.io/npm/v/react-jsondata-editor"></a>
<a href="https://www.npmjs.com/package/json-pointer"> <img alt="npm peer dependency version" src="https://img.shields.io/npm/dependency-version/react-jsondata-editor/peer/json-pointer"></a>
<a href="https://app.travis-ci.com/putma-jun/react-jsondata-editor"><img src="https://app.travis-ci.com/putma-jun/react-jsondata-editor.svg" alt="Build Status" /></a>

A JSON editor library that displays and manipulates JSON objects

# installation
node.js

```
$ npm i react-jsondata-editor
```
(it needs json-pointer) 

# Demo
[Demo](https://json-editor-demo-pib6.vercel.app/)

# usage

input : JSON Object /
output : JSON Object

saveJSON: callback function that returns JSON Object
```
import {JsonEditor} from "react-jsondata-editor"

<JsonEditor input={jsonObject} saveJSON={(output)=> {console.log(output)}} />
```

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
            <JsonEditor input={input} saveJSON={(output)=>{console.log(output)}}/>
        </div>
    )
}

```

# Text area and JSON editor
```javascript

import React, {useState} from "react";
import {JsonEditor} from "react-jsondata-editor";
import styles from './Index.module.css';

export default function Home() {
    let input =
        {"example": {
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

    function saveJsonString(){
        setJsonInput(JSON.stringify(currentEditObj, null, ' '))
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
                            <button type={"button"} onClick={saveJsonString}>
                                <span><i className={styles.arrowLeft}/> String</span>
                            </button>
                        </div>
                    </div>

                    <div className={styles.output}>
                        <JsonEditor input={ ()=>{
                            try{
                                return (JSON.parse(jsonInput))
                            }catch{
                                return "Not JSON format"
                            }
                        }

                        } saveJSON={(input)=>{currentEditObj = input}} />
                    </div>
                </div>

            </div>

        </div>
    )
}

```
