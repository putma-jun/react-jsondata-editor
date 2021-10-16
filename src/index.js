import React, {useRef} from 'react'
import Editor from "./lib/Editor";
import styles from "./lib/styles.module.css"

/**
 * Gets a JSON object and a callback function and calls Editor component
 * Creates a current reference and passes to Editor component
 *
 * @param jsonInput a JSON Object from a user
 * @param onChange a callback function that returns JSON Object
 * @returns {JSX.Element}
 *
 */
function JsonEditor({jsonObject, onChange}) {

    const jsonBoxRef = useRef()

    return (
        <div className={styles.container} ref={jsonBoxRef}>
            <Editor input={jsonObject} jsonBoxRef={jsonBoxRef} saveJSON={onChange}/>
        </div>
    )
}

export {JsonEditor}