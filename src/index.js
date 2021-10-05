import React, {useRef} from 'react'
import Editor from "./lib/Editor";
import styles from "./lib/styles.module.css"

function JsonEditor({input, saveJSON}){
    const jsonBoxRef = useRef()
    return(
        <div className={styles.container} ref={jsonBoxRef}>
            <Editor input={input} jsonBoxRef={jsonBoxRef} saveJSON={saveJSON}/>
        </div>
    )
}

export {JsonEditor}