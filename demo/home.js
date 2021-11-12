import React, {useState} from "react";
import {JsonEditor} from "../src/index";
import * as styles from './Index.module.css';

/**
 *
 * Gets an input from a user and displays the input
 * Calls JsonParser to display a Json Object
 *
 * @returns {JSX.Element}
 *
 */
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

    let currentEditObj = JSON.stringify(input, null, ' ')

    const [jsonInput, setJsonInput] = useState(currentEditObj)

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
                        <div style={{textAlign: "center"}}>
                            <button type={"button"} className={styles.toString} onClick={saveJsonString}><span><i className={styles.arrowLeft}/> String</span>
                            </button>
                        </div>
                    </div>

                    <div className={styles.output}>
                        <JsonEditor jsonObject={ jsonInput } onChange={(output) => {
                            currentEditObj = output;
                        }} />
                    </div>
                </div>

            </div>

            <div className={styles.footer}>
                <span>&copy; Junhyeok Bang - Atoms</span>
            </div>

        </div>
    )
}
