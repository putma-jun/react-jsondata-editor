import styles from "./styles.module.css"
import React, {useEffect, useRef, useState} from "react";
import pointer from "json-pointer";
import ModalEditor from "./ModalEditor";
import DisplayJson from "./DisplayJson";

/**
 * Makes JSON Objects as JSX.Element
 * manipulates the JSON Objects
 * Calls ModalEditor to add to the JSON Object when a users clicks top Insert object <div>
 * @param input jsonData
 * @param jsonBoxRef
 * @param saveJSON
 * @returns {JSX.Element}
 *
 */

export default function Editor({input, jsonBoxRef, saveJSON}) {

    const emptyEditObject = {
        jsonPath: undefined,
        value: undefined,
        field: undefined,
        type: undefined,
        isInArray: undefined,
        isValueArray: undefined,
        isValueObject: undefined,
        currentTop: undefined
    }
    const jsonListOutput = useRef()

    const [overlay, setOverlay] = useState(false)
    const [newObject, setNewObject] = useState(false)
    const [editObject, setEditObject] = useState(emptyEditObject)
    const [jsonData, setJsonData] = useState(input === undefined ? {} : input)

    let tempObj = deepCopy(jsonData)

    useEffect(() => {
        saveJSON(jsonData)
    }, [jsonData])

    function deepCopy(input) {
        return JSON.parse(JSON.stringify(input))
    }

    // delete json object
    function deleteNode(path) {

        if (path === "") {
            tempObj = ""
            setJsonData("")
        } else {
            pointer.remove(tempObj, path)
            setJsonData(deepCopy(tempObj))
        }


    }

    // modify json object
    function changeNode(path, value) {

        if (jsonData === undefined) {
            tempObj = value
            setJsonData(deepCopy(tempObj))
        } else {
            if (path === '/') {
                if (!(jsonData instanceof Object)) {
                    tempObj = {}
                }

                Object.entries(value).map(([key, value]) => {
                    pointer.set(tempObj, '/' + key, value)
                })

            } else {
                pointer.set(tempObj, path, value)
            }
            setJsonData(deepCopy(tempObj))
        }

    }

    // saves information for modal editor when a user clicks add or edit button
    function createModal(jsonPath, value, field, type, isInArray, isValueArray, isValueObject, currentTop) {

        setEditObject({
            jsonPath: jsonPath,
            value: value,
            field: field,
            type: type,
            isInArray: isInArray,
            isValueArray: isValueArray,
            isValueObject: isValueObject,
            currentTop: currentTop
        })

    }

    return (

        <div className={styles.editorContainer}>
            {(overlay || newObject) && <div className={styles.overlay} style={{
                width: jsonBoxRef.current.offsetWidth,
                height: jsonBoxRef.current.offsetHeight,
                margin: "-1em"
            }}/>}
            <div className={styles.boxContainer}>

                {
                    /* shows modal editor when a user clicks + insert object on the top banner */
                    newObject &&
                    <div style={{marginTop: "2.5em", position: "absolute"}}>
                        <ModalEditor hideModal={() => {
                            setNewObject(false)
                        }} jsonPath={''} changeNode={(path, value) => {
                            changeNode(path, value)
                        }} deleteNode={() => {
                            setNewObject(false)
                        }}
                                     editValue={{field: "new"}}
                        />
                    </div>
                }

                {
                    /* shows modal editor when a user clicks add or edit button on right container */
                    (editObject.jsonPath !== undefined) &&
                    <div style={{top: editObject.currentTop, position: "absolute"}}>
                        <ModalEditor jsonPath={editObject.jsonPath}
                                     editValue={{
                                         value: editObject.value,
                                         field: editObject.field,
                                         type: editObject.type,
                                         isInArray: editObject.isInArray,
                                         isValueArray: editObject.isValueArray,
                                         isValueObject: editObject.isValueObject
                                     }}
                                     hideModal={() => {
                                         setEditObject(emptyEditObject);
                                         setOverlay()
                                     }}
                                     deleteNode={deleteNode} changeNode={changeNode}/>
                    </div>
                }

                <div key={"jsonBody"} className={styles.output}>

                    <div className={styles.insertBanner} onClick={() => {
                        setNewObject(true)
                    }}>
                        <span className={styles.bannerSpan}> + Insert object</span>
                    </div>

                    {/* displays json content */}
                    <div className={styles.jsonListOutput} ref={jsonListOutput}>
                        <DisplayJson key={"DisplayJson"}
                                     input={jsonData} indent={1} jsonPath={""} getOverlay={() => {
                            return overlay
                        }} setOverlay={() => {
                            setOverlay(!overlay)
                        }}
                                     deleteNode={(path) => {
                                         deleteNode(path)
                                     }} changeNode={(path, value) => {
                            changeNode(path, value)
                        }}
                                     createModal={(jsonPath, value, field, type, isInArray, isValueArray, isValueObject, currentTop) => {
                                         createModal(jsonPath, value, field, type, isInArray, isValueArray, isValueObject, currentTop)
                                     }}
                                     jsonListOutput={jsonListOutput}/>
                    </div>
                </div>

            </div>
        </div>
    )
}