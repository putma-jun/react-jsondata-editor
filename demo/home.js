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
                            <button type={"button"} onClick={saveJsonString}><span><i className={styles.arrowLeft}/> String</span></button>
                        </div>
                    </div>

                    <div className={styles.output}>
                        <JsonEditor jsonInput={ ()=>{
                            try{
                                return (JSON.parse(jsonInput))
                            }catch{
                                return "Not JSON format"
                            }
                        }

                        } onChange={(input)=>{currentEditObj = input}} />
                    </div>
                </div>

            </div>

            <div className={styles.footer}>
                <span>&copy; Junhyeok Bang - Atoms</span>
            </div>

        </div>
    )
}
