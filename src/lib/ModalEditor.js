import styles from "./styles.module.css"
import React, {useEffect, useState} from "react";
import pointer from "json-pointer";
import TypeOfValue from "./TypeOfValue";

const typeOptions = ["string", "number", "boolean", "null", "object", "array"]

/**
 * Creates new object from user inputs
 *
 * @param editValue
 * @param hideModal
 * @param jsonPath
 * @param deleteNode
 * @param changeNode
 * @returns {JSX.Element}
 * @constructor
 */
export default function ModalEditor({editValue, hideModal, jsonPath, deleteNode, changeNode}) {

    const {value, type, field, isInArray, isValueArray, isValueObject} = editValue || {}
    const modalObj = {}

    if(isValueArray){
        pointer.set(modalObj, '/' + field, JSON.parse(JSON.stringify(value)))
    }else if(isValueObject || isValueObject === undefined){
        pointer.set(modalObj, '/' + field, {})
    }else{
        pointer.set(modalObj, '/' + field, value)
    }

    // removes modal editor
    function cancelNode(){
        hideModal()
    }

    // modify json object
    function saveJsonObject(){
        let typeofValue = TypeOfValue(pointer.get(modalObj, '/' + field))

        if(isValueArray){
            changeNode(jsonPath, JSON.parse(JSON.stringify(pointer.get(modalObj, '/' + field))))
        }else if(isValueObject){
            Object.entries(pointer.get(modalObj, '/' + field)).map(([key]) => {
                changeNode(jsonPath + '/' + key, JSON.parse(JSON.stringify(pointer.get(modalObj, '/' + field + '/' + key))))
            })
        }else if(isValueObject === undefined) {
            changeNode('/', pointer.get(modalObj, '/' + field))
        }else if(typeofValue === "array" || typeofValue === "object"){
            changeNode(jsonPath + '/' + field, JSON.parse(JSON.stringify(pointer.get(modalObj, '/' + field ))))
        }else{
            changeNode(jsonPath + '/' + field, pointer.get(modalObj, '/' + field))
        }

        hideModal()
    }

    // delete node
    function removeObj(){
        deleteNode(jsonPath + '/' + field)
        hideModal()
    }


    return (
        <div key={"ModalEditor"} className={styles.modalContainer}>
            <form onSubmit={(e)=>{ e.preventDefault(); saveJsonObject()}}>
                {
                    (value instanceof Array) ?
                        <ArrayNodeEditor modalObj={modalObj} field={field} path={''} arrayIndex={pointer.get(modalObj, '/' + field).length}/> :
                        (value instanceof Object || isValueObject === undefined) ?
                            <ObjectNodeEditor modalObj={modalObj} ObjKey={field} path={''} /> :
                            <ModalObjectContainer modalObj={modalObj} field={field} value={value} valueType={type} isInArray={isInArray} path={''} isRoot={true}/>
                }

                <div className={styles.modalBtnContainer}>
                    {(isValueArray || isValueObject) ? <div/> :
                    <button type={"button"} onClick={removeObj}> delete </button> }

                    <div className={styles.modalModifyBtnContainer}>
                        <button type={"button"} className={styles.modalModifyBtn} onClick={cancelNode}> Cancel</button>
                        <button type={"submit"} className={styles.modalModifyBtn} > Update</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

/**
 * Creates a basic container for new Object
 * Manipulates by value type
 *
 * @param modalObj
 * @param field
 * @param value
 * @param valueType
 * @param isInArray
 * @param path
 * @param isArray
 * @param isObject
 * @param removeNode
 * @param render
 * @param isRoot
 * @param saveField
 * @returns {JSX.Element}
 *
 */
function ModalObjectContainer({modalObj, field, value, valueType, isInArray, path, isArray, isObject, removeNode, render, isRoot, saveField}) {

    const [inputType, setInputType] = useState(valueType)

    useEffect(()=>{
        setInputType(valueType)
    },[render, value])

    if(modalObj === undefined || inputType === "undefined"){
        return (
            <div>
                <span>undefined</span>
            </div>
        )
    }else if(inputType === "null"){
        return(
            <NullEditor modalObj={modalObj} field={field} path={path} isInArray={isInArray} isArray={isArray} isObject={isObject} isRoot={isRoot} saveType={ (type) => {setInputType(type)}} removeNode={removeNode} saveField={saveField}/>
        )
    }else if(inputType === "boolean"){
        return(
            <BooleanEditor modalObj={modalObj} field={field} path={path} isInArray={isInArray} isObject={isObject} isRoot={isRoot} isArray={isArray} saveType={ (type) => {setInputType(type)}} removeNode={removeNode} render={render} saveField={saveField}/>
        )
    }else if(inputType === "number"){
        return(
            <NumberEditor modalObj={modalObj} field={field} path={path} isInArray={isInArray} isObject={isObject} isRoot={isRoot} isArray={isArray} saveType={ (type) => {setInputType(type)}} removeNode={removeNode} render={render}  saveField={saveField}/>
        )
    }else if(inputType === "string"){
        return(
            <StringEditor modalObj={modalObj} field={field} path={path} isInArray={isInArray} isObject={isObject} isRoot={isRoot} isArray={isArray} saveType={ (type) => {setInputType(type)}} removeNode={removeNode} render={render} saveField={saveField}/>
        )
    }else if(inputType === "array"){

        if(!(pointer.get(modalObj, path + '/' + field) instanceof Array))
            pointer.set(modalObj, path + '/' + field, [""])

        return (
            <ArrayEditor modalObj={modalObj} field={field} path={path} isInArray={isInArray} isObject={isObject} saveType={ (type) => {setInputType(type)}} isRoot={isRoot}  saveField={saveField} removeParentNode={removeNode}/>
        )
    }else {
        //inputType === Object
        if(!(pointer.get(modalObj, path + '/' + field) instanceof Object))
            pointer.set(modalObj, path + '/' + field, {"empty(0)": ""})

        return(
            <ObjectEditor modalObj={modalObj} field={field} path={path} isInArray={isInArray} isObject={isObject} saveType={(type) => {setInputType(type)}} isRoot={isRoot} removeParentNode={removeNode}/>
        )

    }

}

/**
 * Creates a map has null value
 * @param modalObj
 * @param field
 * @param path
 * @param isInArray
 * @param isArray
 * @param isObject
 * @param isRoot
 * @param saveType
 * @param removeNode
 * @param saveField
 * @returns {JSX.Element}
 *
 */
function NullEditor({modalObj, field, path, isInArray, isArray, isObject, isRoot, saveType, removeNode, saveField}) {

    const [inputField, setInputField] = useState(field)

    useEffect(()=>{
        pointer.set(modalObj, path + '/' + inputField, null)
    }, [])

    function ChangeType(e){
        saveType(e.target.value)
    }

    function changeField(e){
        if(saveField(e.target.value, null, field)){
            setInputField(field)
        }
    }

    return (
            <div className={styles.modalContentContainer}>
                <div className={styles.modalInputContainer}>
                    { !isInArray ?
                        <div>
                            <label className={styles.modalLabel}>Key</label>
                        <input value={inputField} className={styles.modalInput} disabled={!isObject} onChange={(e)=>{setInputField(e.target.value)}} onBlur={changeField}/>
                        </div>
                        :
                        <div className={styles.arrayIndex}>
                             <div className={styles.arrayIndexInput}>
                                {inputField}
                             </div>
                        </div>
                    }
                </div>
                <div className={styles.modalNoLabel}>
                    <span> : </span>
                </div>
                <div className={styles.modalInputContainer}>
                    <label className={styles.modalLabel}>Type</label>
                    <select className={styles.modalInput} name={"type"} defaultValue={"null"} onChange={ChangeType}>
                        {typeOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>

                </div>
                <div className={styles.modalNoLabel}>
                {((isArray || isObject) && !isRoot) && <button type={"button"} className={styles.delButton} onClick={()=>{removeNode(modalObj, inputField, path )}}>del</button>}
                </div>
            </div>

    )
}

/**
 * Creates a map has a boolean value
 *
 * @param modalObj
 * @param field
 * @param path
 * @param isInArray
 * @param isArray
 * @param isObject
 * @param isRoot
 * @param saveType
 * @param removeNode
 * @param render
 * @param saveField
 * @returns {JSX.Element}
 *
 */

function BooleanEditor({modalObj, field, path, isInArray, isArray, isObject, isRoot, saveType, removeNode, render, saveField}) {

    const [inputValue, setInputValue] = useState(pointer.get(modalObj, path + '/' + field) !== false)
    const [inputField, setInputField] = useState(field)

    useEffect(()=>{
        pointer.set(modalObj, path + '/' + inputField, inputValue)
    }, [inputValue])

    useEffect(()=>{
        setInputValue(pointer.get(modalObj, path + '/' + field) !== false)
    }, [render])

    function ChangeType(e){
        saveType(e.target.value)
    }

    function changeField(e){
        if(saveField(e.target.value, inputValue, field)){
            setInputField(field)
        }
    }

    return (
        <div className={styles.modalContentContainer}>
            <div className={styles.modalInputContainer}>
                { !isInArray ?
                    <div>
                        <label className={styles.modalLabel}>Key</label>
                        <input value={inputField} className={styles.modalInput} disabled={!isObject} onChange={(e) => {setInputField(e.target.value)}} onBlur={changeField}/>
                    </div>
                    :
                    <div className={styles.arrayIndex}>
                        <div className={styles.arrayIndexInput}>
                            {inputField}
                        </div>
                    </div>
                }
            </div>
            <div className={styles.modalNoLabel}>
                <span> : </span>
            </div>
            <div className={styles.modalInputContainer}>
                <label className={styles.modalLabel}>Type</label>
                <select className={styles.modalInput} name={"type"} defaultValue={"boolean"} onChange={ChangeType}>
                    {typeOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>

            </div>
            <div className={styles.modalInputContainer}>
                <label className={styles.modalLabel}>Value</label>
                <select className={styles.modalInput} value={inputValue} onChange={(e)=>{setInputValue(e.target.value === "true")}}>
                    <option value={true}>true</option>
                    <option value={false}>false</option>
                </select>
            </div>
            <div className={styles.modalNoLabel}>
            {((isArray || isObject) && !isRoot)  && <button type={"button"} className={styles.delButton} onClick={()=>{removeNode(modalObj, inputField, path )}}>del</button>}
            </div>
        </div>

    )
}

/**
 * Creates a map has a number value
 *
 * @param modalObj
 * @param field
 * @param path
 * @param isInArray
 * @param isArray
 * @param isObject
 * @param isRoot
 * @param saveType
 * @param removeNode
 * @param render
 * @param saveField
 * @returns {JSX.Element}
 *
 */
function NumberEditor({modalObj, field, path, isInArray, isArray, isObject, isRoot, saveType, removeNode, render, saveField}) {

    const [inputValue, setInputValue] = useState(typeof pointer.get(modalObj, path + '/' + field) === "number" ? pointer.get(modalObj, path + '/' + field) : 0)
    const [inputField, setInputField] = useState(field)
    const [isValueNum, setIsValueNum] = useState(true)


    useEffect(()=>{
        const numberValue = Number(pointer.get(modalObj, path + '/' + field))

        if(!Number.isNaN(numberValue)) {
            setInputValue(pointer.get(modalObj, path + '/' + field))
            pointer.set(modalObj, path + '/' + inputField, numberValue)
        }
        else{
            setInputValue(0)
            pointer.set(modalObj, path + '/' + inputField, 0)
        }


    }, [render])

    function ChangeType(e){
        saveType(e.target.value)
    }


    function changeField(e){

        if(saveField(e.target.value, inputValue, field)){
            setInputField(field)
        }
    }

    function changeValue(e){
        const numberValue = Number(e.target.value)

        if(e.target.value !== "" && !Number.isNaN(numberValue)) {
            pointer.set(modalObj, path + '/' + inputField, numberValue)
            setIsValueNum(true)
            console.log(modalObj)
        } else {
            pointer.set(modalObj, path + '/' + inputField, 0)
            setIsValueNum(false)
        }
        setInputValue(e.target.value)
    }

    function valueOnBlur(e){
        const numberValue = Number(e.target.value)

        if(inputValue === "" || Number.isNaN(numberValue)) {
            setInputValue(0)
        }
    }


    return (
        <div>
            <div className={styles.modalContentContainer}>
                <div className={styles.modalInputContainer}>

                    { !isInArray ?
                        <div>
                            <label className={styles.modalLabel}>Key</label>
                            <input value={inputField} className={styles.modalInput} disabled={!isObject}  onChange={(e)=>{setInputField(e.target.value)}} onBlur={changeField}/>
                        </div>
                        :
                        <div className={styles.arrayIndex}>
                            <div className={styles.arrayIndexInput}>
                                {inputField}
                            </div>
                        </div>
                    }
                </div>
                <div className={styles.modalNoLabel}>
                    <span> : </span>
                </div>
                <div className={styles.modalInputContainer}>
                    <label className={styles.modalLabel}>Type</label>
                    <select className={styles.modalInput} name={"type"} defaultValue={"number"} onChange={ChangeType}>
                        {typeOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>

                </div>
                <div className={styles.modalInputContainer}>
                    <label className={styles.modalLabel}>Value</label>
                    <input value={inputValue} className={styles.modalInput} onChange={changeValue} placeholder={0} onBlur={valueOnBlur} />
                </div>
                <div className={styles.modalNoLabel}>
                    {((isArray || isObject) && !isRoot)  && <button type={"button"} className={styles.delButton} onClick={()=>{removeNode(modalObj, inputField, path )}}>del</button>}
                </div>
            </div>
            {!isValueNum  && <div>Not a num, will change/save to 0</div>}
        </div>

    )
}

/**
 * Creates a map has a String value
 *
 * @param modalObj
 * @param field
 * @param path
 * @param isInArray
 * @param isArray
 * @param isObject
 * @param isRoot
 * @param saveType
 * @param removeNode
 * @param render
 * @param saveField
 * @returns {JSX.Element}
 *
 */
function StringEditor({modalObj, field, path, isInArray, isArray, isObject, isRoot, saveType, removeNode, render, saveField}) {

    const [inputValue, setInputValue] = useState(typeof pointer.get(modalObj, path + '/' + field) === "string" ? pointer.get(modalObj, path + '/' + field) : "")

    const [inputField, setInputField] = useState(field)

    useEffect(()=>{
        pointer.set(modalObj, path + '/' + inputField, inputValue)
    }, [inputValue])

    useEffect(()=>{
        setInputValue(typeof pointer.get(modalObj, path + '/' + field) === "string" ? pointer.get(modalObj, path + '/' + field) : "")
    }, [render])

    function ChangeType(e){

        saveType(e.target.value)

    }

    function changeField(e){
        if(saveField(e.target.value, inputValue, field)){
            setInputField(field)
        }
    }
    return (
        <div className={styles.modalContentContainer} >
            <div className={styles.modalInputContainer}>

                { !isInArray ?
                    <div>
                        <label className={styles.modalLabel}>Key</label>
                        <input value={inputField} className={styles.modalInput} disabled={!isObject} onChange={(e)=>{setInputField(e.target.value)}} onBlur={changeField}/>
                    </div>
                    :
                    <div className={styles.arrayIndex}>
                        <div className={styles.arrayIndexInput}>
                            {inputField}
                        </div>
                    </div>
                }
            </div>
            <div className={styles.modalNoLabel}>
                <span> : </span>
            </div>
            <div className={styles.modalInputContainer}>
                <label className={styles.modalLabel}>Type</label>
                <select className={styles.modalInput} name={"type"} defaultValue={"string"} onChange={ChangeType}>
                    {typeOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>

            </div>
            <div className={styles.modalInputContainer}>
                <label className={styles.modalLabel}>Value</label>
                <input value={inputValue} className={styles.modalInput} onChange={(e)=>{setInputValue(e.target.value)}}/>
            </div>
            <div className={styles.modalNoLabel}>
                {((isArray || isObject) && !isRoot)  && <button type={"button"} className={styles.delButton} onClick={()=>{removeNode(modalObj, inputField, path )}}>del</button>}
            </div>
        </div>

    )
}

/**
 * Calls ModalObjectContainer to make new array from key or empty
 *
 * @param modalObj
 * @param field
 * @param path
 * @param arrayIndex
 * @returns {JSX.Element}
 *
 */

function ArrayNodeEditor( {modalObj, field,  path, arrayIndex}) {
    //const arrayIndex = pointer.get(modalObj, path + '/' + field).length

    pointer.set(modalObj, path + '/' + field + '/' + arrayIndex, "")

    return (
        <ModalObjectContainer modalObj={modalObj} field={arrayIndex} valueType={"string"} isInArray={true} path={path + '/' + field} isRoot={true}/>
    )
}

/**
 * Creates an array that has a parent component and one index child by followed
 *
 * @param modalObj
 * @param field
 * @param path
 * @param isInArray
 * @param isObject
 * @param saveType
 * @param isRoot
 * @param saveField
 * @param removeParentNode
 * @returns {JSX.Element}
 *
 */
function ArrayEditor({modalObj, field, path, isInArray, isObject, saveType, isRoot, saveField, removeParentNode}){

    const [render, setRender] = useState(false)
    const [arrayField, setArrayField] = useState(field)
    const [isEmpty, setIsEmpty] = useState(false)

    function ChangeType(e){
        pointer.set(modalObj, path + '/' + field, "")
        saveType(e.target.value)

    }

    function changeField(e){
        if(saveField(e.target.value, pointer.get(modalObj, path + '/' + field), field)){
            setArrayField(field)
        }
    }

    function AddNode(){
        pointer.set(modalObj, path + '/'+ arrayField + '/' + pointer.get(modalObj, path + '/' + arrayField).length, "")
        setRender(!render)

    }

    function removeNode(modalObj, arrayField, path) {


        pointer.get(modalObj, path).splice(parseInt(arrayField), 1)

        setRender(!render)

    }

    function removeList(){

        if(isObject || isInArray){
            removeParentNode(modalObj, arrayField, path)
        }else{
            pointer.remove(modalObj, path + '/' + arrayField);
        }

        setArrayField("")
        setIsEmpty(true)
    }

    return(

        isEmpty ? <div/> :
        <div>
            <div className={styles.modalContentContainer}>
                <div className={styles.modalInputContainer}>


                    {!isInArray ?
                        <div>
                            <label className={styles.modalLabel}>Key</label>
                            <input value={arrayField} className={styles.modalInput} disabled={!isObject || isRoot} onChange={(e)=>{setArrayField(e.target.value); }} onBlur={changeField}/>
                        </div>
                        :
                        <div className={styles.arrayIndex}>
                            <div className={styles.arrayIndexInput}>
                                {arrayField}
                            </div>
                        </div>
                    }
                </div>
                <div className={styles.modalNoLabel}>
                    <span> : </span>
                </div>
                <div className={styles.modalInputContainer}>
                    <label className={styles.modalLabel}>Type</label>
                    <select className={styles.modalInput} name={"type"} defaultValue={"array"} onChange={(e) => {
                        ChangeType(e)
                    }}>
                        {typeOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>

                </div>

                <div className={styles.modalNoLabel}>
                    {!(path === "" || isRoot) && <button type={"button"} className={styles.delButton} onClick={removeList}>del</button>}
                </div>
            </div>

                <div className={styles.addLine}>
                    <div className={styles.nodeLine}><p/></div>
                    <div>
                            {Object.entries(pointer.get(modalObj, path + '/' + field)).map(([key, value]) => {
                                return (
                                    <div className={styles.listContainer} key={path + '/' + field + '/' + key}>
                                        <div className={styles.listLine}/>

                                    <ModalObjectContainer modalObj={modalObj} field={key} value={value}
                                                          valueType={TypeOfValue(value)} isInArray={true} isArray={true}
                                                          path={path + '/' + field} removeNode={(modalObj, arrayField, path)=>{removeNode(modalObj, arrayField, path) }} render={render}/>

                                </div>)
                            })}

                        <div className={styles.nodePlusLineContainer}>
                            <div className={styles.nodePlusLine}/>
                            <button type={"button"} onClick={AddNode}>add</button>
                        </div>
                    </div>
                </div>


        </div>

    )

}

/** calls ModalObjectContainer to make new object from key or empty
 *
 * @param modalObj
 * @param ObjKey
 * @param path
 * @returns {JSX.Element}
 *
 */
function ObjectNodeEditor({modalObj, ObjKey, path}) {

    const [field, setField] = useState("empty(0)")

    if(!pointer.has(modalObj, path + '/' + ObjKey + '/' + field)) {
        pointer.set(modalObj, path + '/' + ObjKey + '/' + field, "")

    }

    function saveField(inputField, inputValue) {

        if(!pointer.has(modalObj, path + '/' + ObjKey + '/' + inputField)){
            if(inputValue instanceof Array || inputValue instanceof Object){
                pointer.set(modalObj, path + '/' + ObjKey + '/' +  inputField, JSON.parse(JSON.stringify(inputValue)))
            }else{
                pointer.set(modalObj, path + '/' + ObjKey + '/' +  inputField, inputValue)
            }

            pointer.remove(modalObj, path + '/' + ObjKey + '/' + field)
            setField(inputField)

        }else{
            return true
        }
    }

    return (
        <ModalObjectContainer modalObj={modalObj} field={field} valueType={"string"} isInArray={false} isObject={true} path={path + '/' + ObjKey} isRoot={true} saveField={(inputField, inputValue)=>{saveField(inputField, inputValue)}}/>
    )
}

/**
 * Creates an Object that has a parent component and a child by followed
 *
 * @param modalObj
 * @param field
 * @param path
 * @param isInArray
 * @param isObject
 * @param saveType
 * @param isRoot
 * @param removeParentNode
 * @returns {JSX.Element}
 *
 */
function ObjectEditor({modalObj, field, path, isInArray, isObject, saveType, isRoot, removeParentNode}){

    const [render, setRender] = useState(false)
    const [ObjField, setObjField] = useState(field)
    const [isEmpty, setIsEmpty] = useState(false)

    let error = false

    function ChangeType(e){
        pointer.set(modalObj, path + '/' + field, "")
        saveType(e.target.value)
    }

    //Object field
    function changeField(e){

        if(!pointer.has(modalObj, path + '/' + e.target.value)) {
            pointer.set(modalObj, path + '/' + e.target.value, JSON.parse(JSON.stringify(pointer.get(modalObj, path + '/' + ObjField))))
            pointer.remove(modalObj, path + '/' + ObjField)
            setObjField(e.target.value)
            error = false
        }else{
            error = true
        }
    }

    //value's field
    function saveField(inputField, inputValue, field){

        if(!pointer.has(modalObj, path + '/' + ObjField + '/' + inputField)){

            if(inputValue instanceof Array || inputValue instanceof Object){
                pointer.set(modalObj, path + '/' + ObjField + '/' +  inputField, JSON.parse(JSON.stringify(inputValue)))
            }else{
                pointer.set(modalObj, path + '/' + ObjField + '/' +  inputField, inputValue)

            }
            pointer.remove(modalObj, path + '/' + ObjField + '/' + field)

        }else{
            return true;
        }

        setRender(!render)
    }

    function focusOutField(e){
        if(ObjField !== e.target.value) {
            setObjField(ObjField)
            error = false
        }
    }

    function AddNode() {
        let biggestNum = 0

        Object.entries(pointer.get(modalObj, path + '/' + ObjField)).map(([key]) => {
            if (key.search(/^empty\(\d+\)$/ ) !== -1)  {

                if(parseInt(key.slice(6, -1)) >= biggestNum){
                    biggestNum = parseInt(key.slice(6, -1)) + 1
                }

            }
        })
        pointer.set(modalObj, path + '/' + ObjField + '/' + "empty(" + biggestNum + ")",  "")

        setRender(!render)


    }

    function removeNode(modalObj, inputField, path) {
        pointer.remove(modalObj, path + '/' + inputField);
        setRender(!render)

    }

    function removeList(){

        if(isObject || isInArray){
            removeParentNode(modalObj, ObjField, path)
        }else{
            pointer.remove(modalObj, path + '/' + ObjField);
        }

        setIsEmpty(true)
        setRender(!render)
    }

    return(
            isEmpty ? <div/> :
            <div>
                <div className={styles.modalContentContainer}>
                    <div className={styles.modalInputContainer}>

                        {!isInArray ?
                            <div>
                                <label className={styles.modalLabel}>Key</label>
                                <input value={ObjField} className={styles.modalInput} disabled={isRoot} onChange={changeField} onBlur={focusOutField}/>
                            </div>
                            :
                            <div className={styles.arrayIndex}>
                                <div className={styles.arrayIndexInput}>
                                    {ObjField}
                                </div>
                            </div>

                        }
                    </div>
                    <div className={styles.modalNoLabel}>
                        <span> : </span>
                    </div>
                    <div className={styles.modalInputContainer}>
                        <label className={styles.modalLabel}>Type</label>
                        <select className={styles.modalInput} name={"type"} defaultValue={"object"} onChange={(e) => {
                            ChangeType(e)
                        }}>
                            {typeOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>

                    </div>
                    <div>
                        {error && <p>"error" </p>}
                    </div>
                    <div className={styles.modalNoLabel}>
                        {!(path === "" || isRoot) && <button type={"button"} className={styles.delButton} onClick={removeList}>del</button>}
                    </div>
                </div>

                <div className={styles.addLine}>
                    <div className={styles.nodeLine}><p/></div>

                    <div>
                        <div>
                            {
                                Object.entries(pointer.get(modalObj, path + '/' + ObjField)).map(([key, value]) => {

                                    return (
                                        <div className={styles.listContainer} key={path + '/' + field + '/' + key}>
                                            <div className={styles.listLine}/>

                                            <ModalObjectContainer modalObj={modalObj} field={key} value={value}
                                                              valueType={TypeOfValue(value)} isInArray={false} isArray={false} isObject={true}
                                                              path={path + '/' + ObjField} removeNode={(modalObj, inputField, path)=>{removeNode(modalObj, inputField, path)}} render={render} saveField={saveField}/>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <div className={styles.nodePlusLineContainer}>
                            <div className={styles.nodePlusLine}/>
                            <button type={"button"} onClick={AddNode}>add</button>
                        </div>
                    </div>
                </div>
            </div>
    )
}
