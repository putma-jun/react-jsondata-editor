import React, {useRef} from 'react'
import Editor from "./lib/Editor";
import styles from "./lib/styles.module.css"

/**
 * Gets a JSON object and a callback function and calls Editor component
 * Creates a current reference and passes to Editor component
 *
 * @param input a JSON Object from a user
 * @param saveJSON a callback function that returns JSON Object
 * @returns {JSX.Element}
 *
 */
function JsonEditor({input, saveJSON}) {

    const jsonBoxRef = useRef()

    return (
        <div className={styles.container} ref={jsonBoxRef}>
            <Editor input={input} jsonBoxRef={jsonBoxRef} saveJSON={saveJSON}/>
        </div>
    )
}

export {JsonEditor}