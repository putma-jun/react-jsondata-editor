import styles from "./styles.module.css"
import React, {useEffect, useRef, useState} from "react";
import pointer from "json-pointer";
import ModalEditor from "./ModalEditor";
import DisplayJson from "./DisplayJson";

/**
 * Creates new JSON Object by copying a JSON Object
 * Manipulates new JSON Object and return the JSON Object to a user
 * Calls DisplayJson component to display
 * Calls ModalEditor to add an Object when a users clicks top Insert object <div>
 *
 *
 * @param input a JSON Object from a user
 * @param jsonBoxRef a parent reference that has a current position
 * @param saveJSON a callback function that returns JSON Object
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

    // indicates y-scroll
    const jsonListOutput = useRef()
    // blocks focus while a user edits
    const [overlay, setOverlay] = useState(false)
    // shows modal editor when a user clicks "+ insert object" on the top banner
    const [newObject, setNewObject] = useState(false)
    // shows modal editor when a user clicks "add" or "edit" button on right container
    const [editObject, setEditObject] = useState(emptyEditObject)
    // new json object to manipulate
    const [jsonData, setJsonData] = useState(input)

    let tempObj = deepCopy(jsonData)

    // after change the json object, it calls a callback function to return new json object
    useEffect(() => {
        saveJSON(jsonData)
    }, [jsonData])

    // re render
    useEffect(()=>{
        setJsonData(input)
    }, [input])


    function deepCopy(input) {

        if(input === undefined){
            return undefined
        }else if (input === null){
            return null
        }else{
            return JSON.parse(JSON.stringify(input))
        }
    }

    // delete json object
    function deleteNode(path) {

        if (path === "") {
            tempObj = ""
            setJsonData(undefined)
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
            if(path === ''){
                tempObj = value
                setJsonData(deepCopy(tempObj))
            }
            else if (path === '/') {
                if(jsonData instanceof Array){

                    let arrayIndex = pointer.get(jsonData, '').length

                    Object.entries(value).map(([key, value]) => {
                        pointer.set(tempObj, '/' + arrayIndex + '/' + key, value)
                    })
                }
                else{
                    if (!(jsonData instanceof Object)) {
                        tempObj = {}
                    }

                    Object.entries(value).map(([key, value]) => {
                        pointer.set(tempObj, '/' + key, value)
                    })

                }
            } else {
                pointer.set(tempObj, path, value)
            }
            setJsonData(deepCopy(tempObj))
        }

    }

    // saves information for modal editor when a user clicks "add" or "edit" button
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

            {
                (overlay || newObject) &&

                <div className={styles.overlay} style={{
                    width: jsonBoxRef.current.offsetWidth,
                    height: jsonBoxRef.current.offsetHeight,
                    margin: "-1em"
                }}/>
            }

            <div className={styles.boxContainer}>
                {
                    // shows modal editor when a user clicks "+ insert object" on the top banner
                    newObject &&
                    <div style={{marginTop: "2.5em", position: "absolute"}}>
                        <ModalEditor
                            hideModal={() => { setNewObject(false) }}
                            jsonPath={''}
                            changeNode={(path, value) => { changeNode(path, value) }}
                            deleteNode={() => { setNewObject(false) }}
                            editValue={{field: "new"}} />
                    </div>
                }

                {
                    // shows modal editor when a user clicks "add" or "edit" button on right container
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
                                         setOverlay(!overlay)
                                     }}
                                     deleteNode={deleteNode} changeNode={changeNode}/>
                    </div>
                }

                <div key={"jsonBody"} className={styles.output}>

                    <div className={styles.insertBanner} onClick={() => { setNewObject(true) }}>
                        <span className={styles.bannerSpan}> + Insert object</span>
                    </div>

                    {/* displays json content */}
                    <div className={styles.jsonListOutput} ref={jsonListOutput}>
                        <DisplayJson key={"DisplayJson"}
                                     input={jsonData}
                                     indent={1}
                                     jsonPath={""}
                                     setOverlay={() => { setOverlay(!overlay)}}
                                     deleteNode={(path) => { deleteNode(path) }}
                                     changeNode={(path, value) => { changeNode(path, value)}}
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