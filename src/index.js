import React, {useContext, useRef} from 'react'
import Editor from "./Editor";
import styles from "./lib/styles.module.css"
import UserContext from "./UserContext"


/**
 * Gets a JSON object and a callback function and calls Editor component
 * Creates a current reference and passes to Editor component
 *
 * @param jsonInput a JSON Object from a user
 * @param onChange a callback function that returns JSON Object
 * @returns {JSX.Element}
 *
 */
function JsonEditor({jsonObject, onChange, theme, bannerStyle, keyStyle, valueStyle, buttonStyle}) {

    const jsonBoxRef = useRef()
    const defaultStyle = useContext(UserContext)

    return (
        <UserContext.Provider value={{
            themes: theme === undefined ? defaultStyle.themes : theme,
            banner: bannerStyle === undefined ? defaultStyle.banner : bannerStyle,
            key: keyStyle === undefined ? defaultStyle.key : keyStyle,
            values: valueStyle === undefined ? defaultStyle.values : valueStyle,
            buttons: buttonStyle === undefined ? defaultStyle.buttons : buttonStyle
        }}>
            <div className={styles.container} ref={jsonBoxRef}>
                <Editor input={jsonObject} jsonBoxRef={jsonBoxRef} onChange={onChange}/>
            </div>
        </UserContext.Provider>
    )
}

export {JsonEditor}