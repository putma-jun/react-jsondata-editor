import styles from "./lib/styles.module.css"
import React, {useContext, useEffect, useRef, useState} from "react";
import DeepCopy from "./lib/DeepCopy";
import pointer from "json-pointer";
import ModalEditor from "./ModalEditor";
import JsonView from "./JsonView";
import UserContext from "./UserContext";
import ModalPrimitive from "./ModalPrimitive";

/**
 * Creates new JSON Object by copying a JSON Object
 * Manipulates new JSON Object and return the JSON Object to a user
 * Calls DisplayJson component to display
 * Calls ModalEditor to add an Object when a users clicks top Insert object <div>
 *
 * @param input a JSON string from a user
 * @param jsonBoxRef a parent reference that has a current position
 * @param onChange a callback function that returns JSON string
 * @returns {JSX.Element}
 *
 */
export default function Editor({input, jsonBoxRef, onChange, hideInsertObjectButton, expandToGeneration, isReadOnly}) {

    const emptyValues = {
            path : undefined,
            field: undefined,
            value: undefined,
            isInArray: undefined
        }

    // indicates y-scroll
    const jsonListOutput = useRef()
    // new json object to manipulate
    const [jsonData, setJsonData] = useState()
    // blocks focus while a user edits
    const [overlay, setOverlay] = useState(false)
    // shows modal editor
    const [editObject, setEditObject] = useState(emptyValues)
    // indicates position click node
    const [currentTop, setCurrentTop] = useState(0)
    const [editPrimitive, setEditPrimitive] = useState()
    const [selectType, setSelectType] = useState(false)

    const userStyle = useContext(UserContext)
    // indicates hover event
    const [focusOnBanner, setFocusOnBanner] = useState(false)

    //setPrimitive
    let tempObj = DeepCopy(jsonData)

    // re-render when input changes
    useEffect(() => {
        setJsonData(toJSON(input))
        setOverlay(false)
        setEditPrimitive(undefined)
    }, [input])

    // calls onChange when data changes
    function saveJsonData(newData, deepCopy){

        if(deepCopy)
            setJsonData(DeepCopy(newData))
        else
            setJsonData(newData)

        onChange(JSON.stringify(newData, null, ' '))
    }

    function toJSON(jsonStr){

        try{
          return JSON.parse(jsonStr)
        } catch{
            return undefined
        }

    }

    // delete json object
    function deleteNode(path) {

        if (path === "") {
            tempObj = undefined
            saveJsonData(undefined)
        } else if (path !== undefined){
            pointer.remove(tempObj, path)
            saveJsonData(tempObj, tempObj instanceof Object)
        }

        if(overlay)
            setOverlay(false)

    }

    // saves information for modal primitive
    function setPrimitive(value, position){

        setCurrentTop(position)
        setEditPrimitive(value)

    }

    // changes primitive value
    function savePrimitive(inputText){

        if(inputText !== undefined){

            let tempValue

            if (inputText.charAt(0) === '"' && inputText.endsWith('"')){
                tempValue = inputText.slice(1,-1)
            }else if(inputText === "null"){
                tempValue = null
            }else if(inputText === "true" || inputText === "false"){
                tempValue = inputText === "true"
            }else if(!Number.isNaN(Number(inputText))){
                tempValue = Number(inputText)
            }else{
                tempValue = inputText
            }

            saveJsonData(tempValue)
        }

        setEditPrimitive(undefined)
    }

    // modify json object
    function changeNode(path, value) {

        if (jsonData === undefined || path === '') {
            tempObj = value
            saveJsonData(tempObj, tempObj instanceof Object)
        } else {
            if (path === '/') {

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

                saveJsonData(tempObj, true)
            } else {

                pointer.set(tempObj, path, value)
                saveJsonData(tempObj, true)

            }
        }

        setOverlay(false)
    }

    // saves information for modal editor
    function createModal(path, field = undefined, value = undefined, isInArray = undefined, position) {

        if(field === undefined && jsonData instanceof Array){
            setEditObject({
                path : '/',
                field : Array.from(jsonData).length,
                value : jsonData,
                isInArray : isInArray
            })
        }else{

            setEditObject({
                path : path,
                field : field,
                value : value,
                isInArray : isInArray
            })
        }
        setCurrentTop(position)
        setOverlay(true)
    }


    return (
        <div className={styles.editorContainer}>

            {overlay &&
            <div>
                <div className={styles.overlay} style={{
                    width: jsonBoxRef.current.offsetWidth,
                    height: jsonBoxRef.current.offsetHeight,
                }}/>
                <div style={{top: currentTop, position: "absolute"}}>
                    <ModalEditor editObject={editObject} changeNode={changeNode} deleteNode={deleteNode}/>
                </div>
            </div>
            }

            {editPrimitive !== undefined &&
            <div>
                <div className={styles.overlay} style={{
                    width: jsonBoxRef.current.offsetWidth,
                    height: jsonBoxRef.current.offsetHeight,
                }}/>
                <div style={{top: currentTop, position: "absolute"}}>
                <ModalPrimitive primitiveValue={editPrimitive} savePrimitive={savePrimitive}/>
                </div>
            </div>
            }

            { jsonData === undefined && selectType &&
            <div className={styles.modalContainer} style={{minWidth: '300px'}}>
                <div>
                    <label className={styles.modalSelectLabel}
                           style={{font: userStyle.key.font}}>Please select
                        type of new data</label>
                </div>
                <div className={styles.modalSelectBtnContainer}>
                    <button type={"button"} className={styles.modalSelectBtn}
                            style={{backgroundColor: userStyle.themes.color}} onClick={() => {
                        setPrimitive(""); setSelectType(false)
                    }}><span style={{font:userStyle.values.font, lineHeight:"normal"}}>Text</span></button>
                    <button type={"button"} className={styles.modalSelectBtn}
                            style={{backgroundColor: userStyle.themes.color}} onClick={() => {
                        createModal(""); setSelectType(false)
                    }}><span style={{font:userStyle.values.font, lineHeight:"normal"}}>Object</span></button>
                </div>
            </div>
            }

            <div key={"jsonBody"} className={styles.JsonViewOutput}>
                {!hideInsertObjectButton && !isReadOnly &&
                  <div className={styles.insertBanner} style={{backgroundColor: focusOnBanner ? userStyle.banner.hoverColor : userStyle.themes.color}}
                      onMouseOver={()=>{setFocusOnBanner(true)}} onMouseLeave={()=>{setFocusOnBanner(false)}} onClick={()=>{
                          jsonData !== undefined ? createModal("") : setSelectType(true)}}>
                      <span className={styles.bannerSpan} style={{color: userStyle.banner.fontColor, font: userStyle.banner.font}}> + Insert Object</span>
                  </div>
                }
                <div className={styles.jsonListOutput} ref={jsonListOutput}>
                    <JsonView key={"DisplayJson"}
                              input={jsonData}
                              jsonPath={""}
                              jsonListOutput={jsonListOutput}
                              deleteNode={deleteNode}
                              setPrimitive={setPrimitive}
                              createModal={createModal}
                              expandToGeneration={expandToGeneration}
                              isReadOnly={isReadOnly}
                              />
                </div>
            </div>

        </div>
    )
}