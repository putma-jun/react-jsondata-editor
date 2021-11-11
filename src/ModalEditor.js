import React, {useContext, useEffect, useState} from "react";
import pointer from "json-pointer";
import TypeOfValue from "./lib/TypeOfValue";
import styles from "./lib/styles.module.css"
import DeepCopy from "./lib/DeepCopy";
import UserContext from "./UserContext";

// JSON Object type options for select
const typeOptions = ["string", "number", "boolean", "null", "object", "array"]

/**
 * Creates a modal to add new object from user inputs
 *
 * @param editValue path, field, value, isInArray
 * @param changeNode modifies the JSON Object
 * @param deleteNode deletes an object from the JSON Object
 * @returns {JSX.Element}
 */
export default function ModalEditor({editObject, changeNode, deleteNode}) {


    const {path, field, value, isInArray} = editObject || {}
    const modalObj = {}
    const valueType = TypeOfValue(value)
    const userStyle = useContext(UserContext)

    if (field === undefined) {
        pointer.set(modalObj, '/undefined/', "")
    } else if (valueType === "array") {
        pointer.set(modalObj, '/' + field + '/' + value.length, "")
    } else if (valueType === "object") {
        pointer.set(modalObj, '/' + field, {})
    } else {
        pointer.set(modalObj, '/' + field, value)
    }

    // saves json object
    function saveJsonObject() {

        if (valueType === "array") {
            if(path === '/'){
                changeNode('/' + field, DeepCopy(pointer.get(modalObj, '/' + field + '/' + value.length)))
            }else
                changeNode(path + '/' + field + '/' + value.length, DeepCopy(pointer.get(modalObj, '/' + field + '/' + value.length)))
        } else if (valueType === "object") {
            Object.keys(pointer.get(modalObj, '/' + field)).forEach((key) => {
                changeNode(path + '/' + field + '/' + key, DeepCopy(pointer.get(modalObj, '/' + field + '/' + key)))
            })
        } else {
            const notInObject = pointer.get(modalObj, '/' + field)
            const typeofValue = TypeOfValue(notInObject)

            if (field === undefined) {
                changeNode('/', notInObject)
            } else if (typeofValue === "array" || typeofValue === "object") {
                changeNode(path + '/' + field, DeepCopy(notInObject))
            } else {
                changeNode(path + '/' + field, notInObject)
            }
        }
    }

    return (
        <div key={"ModalEditor"} className={styles.modalContainer}>
            <form onSubmit={(e) => {
                e.preventDefault();
                saveJsonObject()
            }}>
                {
                    (valueType === "array") ?
                        <ModalObjectContainer modalObj={modalObj} path={'/' + field} field={value.length}
                                              valueType={"string"} isInArray={true} isRoot={true}/>
                        : (valueType === "object" || field === undefined) ?
                        <ObjectNodeEditor modalObj={modalObj} ObjKey={field} path={''}/>
                        :
                        <ModalObjectContainer modalObj={modalObj} path={''} field={field} valueType={valueType}
                                              isInArray={isInArray} isRoot={true}/>
                }
                <div className={styles.modalBtnContainer}>
                    {(valueType === "object") ? <div/> :
                        <button type={"button"} className={styles.modalButton} style={{fontFamily:userStyle.values.fontFamily, backgroundColor:userStyle.buttons.delete}}
                                onClick={() => {
                            deleteNode(path + '/' + field)
                        }}> Delete </button>}

                    <div className={styles.modalModifyBtnContainer}>
                        <button type={"button"} className={styles.modalButton} style={{fontFamily:userStyle.values.fontFamily, backgroundColor:userStyle.buttons.cancel}}
                                onClick={() => {
                            deleteNode(undefined)
                        }}> Cancel
                        </button>
                        <button type={"submit"} className={styles.modalButton} style={{fontFamily:userStyle.values.fontFamily, backgroundColor:userStyle.buttons.update}}> Update</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

// deletes node
function removeNode(modalObj, path, inputField, isInArray) {

    if (isInArray) {
        pointer.get(modalObj, path).splice(parseInt(inputField), 1)
        pointer.set(modalObj, path, DeepCopy(pointer.get(modalObj, path)))
    } else {
        pointer.remove(modalObj, path + '/' + inputField);
    }

}

// set default value when a user changes type
function setDefaultValue(type) {

    if (type === "null") {
        return null
    } else if (type === "boolean") {
        return true
    } else if (type === "number") {
        return 0
    } else if (type === "string") {
        return ''
    } else if (type === "array") {
        return [""]
    } else {
        return {}
    }

}

/**
 * Creates a basic container for new Object
 * Manipulates by value type
 *
 * @param modalObj temp JSON Object that holds new data
 * @param path current path
 * @param field key
 * @param valueType type of value
 * @param isInArray indicates input is instanceof Array
 * @param isRoot indicates root
 * @param saveField saves key
 * @param rerender re-render
 * @returns {JSX.Element}
 *
 */
function ModalObjectContainer({modalObj, path, field, valueType, isInArray, isRoot, saveField, rerender}) {

    const [inputType, setInputType] = useState(valueType)

    useEffect(() => {
        setInputType(valueType)
    }, [valueType])

    if (inputType === "undefined") {
        return <div>undefined</div>
    } else if (inputType === "null") {

        return <NullEditor modalObj={modalObj} path={path} field={field} isInArray={isInArray} isRoot={isRoot}
                           saveType={(type) => { setInputType(type)}} saveField={saveField} rerender={rerender}/>

    } else if (inputType === "boolean") {

        return <BooleanEditor modalObj={modalObj} path={path} field={field} isInArray={isInArray} isRoot={isRoot}
                              saveType={(type) => { setInputType(type)}} saveField={saveField} rerender={rerender}/>

    } else if (inputType === "number") {

        return <NumberEditor modalObj={modalObj} path={path} field={field} isInArray={isInArray} isRoot={isRoot}
                             saveType={(type) => { setInputType(type)}} saveField={saveField} rerender={rerender}/>

    } else if (inputType === "string") {

        return <StringEditor modalObj={modalObj} path={path} field={field} isInArray={isInArray} isRoot={isRoot}
                             saveType={(type) => { setInputType(type)}} saveField={saveField} rerender={rerender}/>

    } else if (inputType === "array") {

        return <ArrayEditor modalObj={modalObj} path={path} field={field} isInArray={isInArray} isRoot={isRoot}
                            saveType={(type) => { setInputType(type)}} saveField={saveField} rerender={rerender}/>

    } else {
        return <ObjectEditor modalObj={modalObj} path={path} field={field} isInArray={isInArray} isRoot={isRoot}
                             saveType={(type) => { setInputType(type) }} saveField={saveField} rerender={rerender}/>
    }

}

/**
 * Creates a null component has null value
 * Changes to another type when type is changed
 *
 * @param modalObj temp JSON Object that holds new data
 * @param path current path
 * @param field key
 * @param isInArray indicates input is instanceof Array
 * @param isRoot indicates root
 * @param saveType saves type of value
 * @param saveField saves key
 * @param rerender re-render
 * @returns {JSX.Element}
 *
 */
function NullEditor({modalObj, path, field, isInArray, isRoot, saveType, saveField, rerender}) {

    const [inputField, setInputField] = useState(field)

    useEffect(() => {
        pointer.set(modalObj, path + '/' + inputField, null)
    }, [])

    function ChangeType(newType) {
        pointer.set(modalObj, path + '/' + field, setDefaultValue(newType))
        saveType(newType)
    }

    // changes field if there is not the same field
    // when there is same field, returns previous field
    function changeField(inputField) {
        if (saveField(inputField, null, field))
            setInputField(field)
    }

    return (
        <div className={styles.modalContentContainer}>
            <div>
                {!isInArray ?
                    <div>
                        <label className={styles.modalLabel}>Key</label>
                        <input value={inputField} className={styles.modalInput} disabled={isRoot} onChange={(e) => {
                            setInputField(e.target.value)
                        }} onBlur={(e) => {
                            changeField(e.target.value)
                        }}/>
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
            <div>
                <label className={styles.modalLabel}>Type</label>
                <select className={styles.modalInput} name={"type"} defaultValue={"null"} onChange={(e) => {
                    ChangeType(e.target.value)
                }}>
                    {typeOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>

            </div>
            <div className={styles.modalNoLabel}>
                {
                    (!isRoot && rerender !== undefined) &&
                    <div className={styles.delButton}>
                        <i className={styles.removeIcon}
                           onClick={() => {
                                   removeNode(modalObj, path, inputField, isInArray);
                                   rerender();}}/>
                    </div>
                }
            </div>
        </div>

    )
}

/**
 * Creates a Boolean component
 * Changes to another type when type is changed
 *
 * @param modalObj temp JSON Object that holds new data
 * @param path current path
 * @param field key
 * @param isInArray indicates input is instanceof Array
 * @param isRoot indicates root
 * @param saveType saves type of value
 * @param saveField saves key
 * @param rerender re-render
 * @returns {JSX.Element}
 *
 */
function BooleanEditor({modalObj, path, field, isInArray, isRoot, saveType, saveField, rerender}) {

    const [inputField, setInputField] = useState(field)
    const [inputValue, setInputValue] = useState(pointer.get(modalObj, path + '/' + field) !== false)

    function saveValue(newValue) {
        setInputValue(newValue)
        pointer.set(modalObj, path + '/' + inputField, newValue)
    }

    function changeType(newType) {
        pointer.set(modalObj, path + '/' + field, setDefaultValue(newType))
        saveType(newType)
    }

    // changes field if there is not the same field
    // when there is same field, returns previous field
    function changeField(inputField) {
        if (saveField(inputField, inputValue, field))
            setInputField(field)
    }

    return (
        <div className={styles.modalContentContainer}>
            <div>
                {!isInArray ?
                    <div>
                        <label className={styles.modalLabel}>Key</label>
                        <input value={inputField} className={styles.modalInput} disabled={isRoot} onChange={(e) => {
                            setInputField(e.target.value)
                        }} onBlur={(e) => {
                            changeField(e.target.value)
                        }}/>
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
            <div>
                <label className={styles.modalLabel}>Type</label>
                <select className={styles.modalInput} name={"type"} defaultValue={"boolean"} onChange={(e) => {
                    changeType(e.target.value)
                }}>
                    {typeOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>

            </div>
            <div>
                <label className={styles.modalLabel}>Value</label>
                <select className={styles.modalBooleanInput} value={inputValue} onChange={(e) => {
                    saveValue(e.target.value === "true")
                }}>
                    <option value={true}>true</option>
                    <option value={false}>false</option>
                </select>
            </div>
            <div className={styles.modalNoLabel}>
                {(!isRoot && rerender !== undefined) &&
                <div className={styles.delButton}>
                    <i className={styles.removeIcon}
                       onClick={() => {
                           removeNode(modalObj, path, inputField, isInArray);
                           rerender();}}/>
                </div>
                }
            </div>
        </div>

    )
}
/**
 * Creates a number component
 * Changes to another type when type is changed
 *
 * @param modalObj temp JSON Object that holds new data
 * @param path current path
 * @param field key
 * @param isInArray indicates input is instanceof Array
 * @param isRoot indicates root
 * @param saveType saves type of value
 * @param saveField saves key
 * @param rerender re-render
 * @returns {JSX.Element}
 *
 */
function NumberEditor({modalObj, path, field, isInArray, isRoot, saveType, saveField, rerender}) {

    const [inputField, setInputField] = useState(field)
    const [inputValue, setInputValue] = useState(pointer.get(modalObj, path + '/' + field))
    // indicates value is number
    const [isValueNum, setIsValueNum] = useState(true)

    function ChangeType(newType) {
        pointer.set(modalObj, path + '/' + field, setDefaultValue(newType))
        saveType(newType)
    }

    // changes field if there is not the same field
    // when there is same field, returns previous field
    function changeField(inputField) {
        if (saveField(inputField, inputValue, field))
            setInputField(field)
    }

    // when a user types, changes value if input is a number else saves 0
    function changeValue(inputValue) {
        const numberValue = Number(inputValue)

        if (inputValue !== "" && !Number.isNaN(numberValue)) {
            pointer.set(modalObj, path + '/' + inputField, numberValue)
            setIsValueNum(true)
        } else {
            pointer.set(modalObj, path + '/' + inputField, 0)
            setIsValueNum(false)
        }
        setInputValue(inputValue)
    }

    // when a user completes, changes value if input is not a number then sets 0
    function valueOnBlur(inputValue) {
        const numberValue = Number(inputValue)

        if (inputValue === "" || Number.isNaN(numberValue)) {
            setInputValue(0)
        }
    }

    return (
        <div>
            <div className={styles.modalContentContainer}>
                <div>

                    {!isInArray ?
                        <div>
                            <label className={styles.modalLabel}>Key</label>
                            <input value={inputField} className={styles.modalInput} disabled={isRoot} onChange={(e) => {
                                setInputField(e.target.value)
                            }} onBlur={(e) => {
                                changeField(e.target.value)
                            }}/>
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
                <div>
                    <label className={styles.modalLabel}>Type</label>
                    <select className={styles.modalInput} name={"type"} defaultValue={"number"} onChange={(e) => {
                        ChangeType(e.target.value)
                    }}>
                        {typeOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>

                </div>
                <div>
                    <label className={styles.modalLabel}>Value</label>
                    <input value={inputValue} className={styles.modalInput} onChange={(e) => {
                        changeValue(e.target.value)
                    }} onBlur={(e) => {
                        valueOnBlur(e.target.value)
                    }}/>
                </div>
                <div className={styles.modalNoLabel}>
                    {(!isRoot && rerender !== undefined) &&
                    <div className={styles.delButton}>
                        <i className={styles.removeIcon}
                           onClick={() => {
                               removeNode(modalObj, path, inputField, isInArray);
                               rerender();}}/>
                    </div>
                    }
                </div>
            </div>
            {!isValueNum && <div>Not a num, will change/save to 0</div>}
        </div>

    )
}

/**
 * Creates a string component
 * Changes to another type when type is changed
 *
 * @param modalObj temp JSON Object that holds new data
 * @param path current path
 * @param field key
 * @param isInArray indicates input is instanceof Array
 * @param isRoot indicates root
 * @param saveType saves type of value
 * @param saveField saves key
 * @param rerender re-render
 * @returns {JSX.Element}
 *
 */
function StringEditor({modalObj, path, field, isInArray, isRoot, saveType, saveField, rerender}) {

    const [inputField, setInputField] = useState(field)
    const [inputValue, setInputValue] = useState(pointer.get(modalObj, path + '/' + field))

    function saveValue(newValue) {
        setInputValue(newValue)
        pointer.set(modalObj, path + '/' + inputField, newValue)
    }

    function changeType(newType) {

        pointer.set(modalObj, path + '/' + inputField, setDefaultValue(newType))
        saveType(newType)
    }

    // changes field if there is not the same field
    // when there is same field, returns previous field
    function changeField(inputField) {
        if (saveField(inputField, inputValue, field))
            setInputField(field)
    }

    return (
        <div className={styles.modalContentContainer}>
            <div>

                {!isInArray ?
                    <div>
                        <label className={styles.modalLabel}>Key</label>
                        <input value={inputField} className={styles.modalInput} disabled={isRoot} onChange={(e) => {
                            setInputField(e.target.value)
                        }} onBlur={(e) => {
                            changeField(e.target.value)
                        }}/>
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
            <div>
                <label className={styles.modalLabel}>Type</label>
                <select className={styles.modalInput} name={"type"} defaultValue={"string"} onChange={(e) => {
                    changeType(e.target.value)
                }}>
                    {typeOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>

            </div>
            <div>
                <label className={styles.modalLabel}>Value</label>
                <input value={inputValue} className={styles.modalInput} onChange={(e) => {
                    saveValue(e.target.value)
                }}/>
            </div>
            <div className={styles.modalNoLabel}>
                {(!isRoot && rerender !== undefined) &&
                <div className={styles.delButton}>
                    <i className={styles.removeIcon}
                       onClick={() => {
                           removeNode(modalObj, path, inputField, isInArray);
                           rerender();}}/>
                </div>
                }
            </div>
        </div>

    )
}

/**
 * Creates a array component
 * Changes to another type when type is changed
 *
 * @param modalObj temp JSON Object that holds new data
 * @param path current path
 * @param field key
 * @param isInArray indicates input is instanceof Array
 * @param isRoot indicates root
 * @param saveType saves type of value
 * @param saveField saves key
 * @param rerender re-render
 * @returns {JSX.Element}
 *
 */
function ArrayEditor({modalObj, path, field, isInArray, isRoot, saveType, saveField, rerender}) {

    const [render, setRender] = useState(false)
    const [arrayField, setArrayField] = useState(field)

    function ChangeType(newType) {
        pointer.set(modalObj, path + '/' + field, setDefaultValue(newType))
        saveType(newType)
    }

    // changes field if there is not the same field
    // when there is same field, returns previous field
    function changeField(e) {
        if (saveField(e.target.value, pointer.get(modalObj, path + '/' + field), field))
            setArrayField(field)
    }

    // adds new line
    function AddNode() {
        pointer.set(modalObj, path + '/' + arrayField + '/' + pointer.get(modalObj, path + '/' + arrayField).length, "")
        setRender(!render)
    }

    // removes this component
    function removeList() {
        removeNode(modalObj, path, arrayField, isInArray)
        rerender()
    }

    return (
        <div>
            <div className={styles.modalContentContainer}>
                <div>

                    {!isInArray ?
                        <div>
                            <label className={styles.modalLabel}>Key</label>
                            <input value={arrayField} className={styles.modalInput} disabled={isRoot} onChange={(e) => {
                                setArrayField(e.target.value);
                            }} onBlur={changeField}/>
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
                <div>
                    <label className={styles.modalLabel}>Type</label>
                    <select className={styles.modalInput} name={"type"} defaultValue={"array"} onChange={(e) => {
                        ChangeType(e.target.value)
                    }}>
                        {typeOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>

                </div>

                <div className={styles.modalNoLabel}>
                    {!(path === "" || isRoot || rerender === undefined) &&
                    <div className={styles.delButton}>
                        <i className={styles.removeIcon}
                           onClick={removeList}/>
                    </div>
                    }
                </div>
            </div>

            <div className={styles.addLine}>
                <div className={styles.nodeLine}><p/></div>
                <div>
                    {Object.entries(pointer.get(modalObj, path + '/' + field)).map(([key, value]) => {
                        return (
                            <div className={styles.listContainer} key={path + '/' + field + '/' + key + '/' + render}>
                                <div className={styles.listLine}/>

                                <ModalObjectContainer modalObj={modalObj} path={path + '/' + field} field={key}
                                                      valueType={TypeOfValue(value)} isInArray={true} render={render}
                                                      rerender={() => {
                                                          setRender(!render)
                                                      }}/>

                            </div>)
                    })}

                    <div className={styles.nodePlusLineContainer}>
                        <div className={styles.nodePlusLine}/>
                        <div className={styles.addButton} >
                            <i className={styles.addIcon}
                               onClick={AddNode}/>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    )

}

/**
 * Creates a object container when a user creates new object
 * Changes to another type when type is changed
 *
 * @param modalObj temp JSON Object that holds new data
 * @param path current path
 * @param field key
 * @returns {JSX.Element}
 *
 */
function ObjectNodeEditor({modalObj, ObjKey, path}) {

    const [field, setField] = useState("")

    // sets initial object
    if (!pointer.has(modalObj, path + '/' + ObjKey + '/' + field)) {
        pointer.set(modalObj, path + '/' + ObjKey + '/' + field, "")
    }

    // saves new field if there is no duplicate
    function saveField(inputField, inputValue, currentField) {

        if (!pointer.has(modalObj, path + '/' + ObjKey + '/' + inputField)) {
            if (inputValue instanceof Object) {
                pointer.set(modalObj, path + '/' + ObjKey + '/' + inputField, DeepCopy(inputValue))
            } else {
                pointer.set(modalObj, path + '/' + ObjKey + '/' + inputField, inputValue)
            }
            pointer.remove(modalObj, path + '/' + ObjKey + '/' + currentField)
            setField(inputField)

        } else {
            return true
        }
    }

    return (
        <ModalObjectContainer modalObj={modalObj} path={path + '/' + ObjKey} field={field} valueType={"string"}
                              isInArray={false} isRoot={false} saveField={saveField}/>
    )
}

/**
 * Creates a Object component
 * Changes to another type when type is changed
 *
 * @param modalObj temp JSON Object that holds new data
 * @param path current path
 * @param field key
 * @param isInArray indicates input is instanceof Array
 * @param isRoot indicates root
 * @param saveType saves type of value
 * @param saveField saves key
 * @param rerender re-render
 * @returns {JSX.Element}
 *
 */
function ObjectEditor({modalObj, path, field, isInArray, isRoot, saveType, rerender}) {

    const [render, setRender] = useState(false)
    const [ObjField, setObjField] = useState(field)
    // indicates if fields are duplicate
    const [hasEmptyField, setHasEmptyField] = useState(false)

    // sets initial object
    useEffect(() => {
        pointer.set(modalObj, path + '/' + ObjField + '/' + '', '')
        setRender(!render)
    }, [])

    useEffect(() => {
        setHasEmptyField(false)
    }, [render])

    function ChangeType(newType) {
        pointer.set(modalObj, path + '/' + ObjField, setDefaultValue(newType))
        saveType(newType)
    }

    // change its filed
    function changeField(inputValue) {
        if (!pointer.has(modalObj, path + '/' + inputValue)) {
            pointer.set(modalObj, path + '/' + inputValue, DeepCopy(pointer.get(modalObj, path + '/' + ObjField)))
            pointer.remove(modalObj, path + '/' + ObjField)
            setObjField(inputValue)
        }
    }

    // saves new field of child component if there is no duplicate
    function saveField(inputField, inputValue, currentField) {

        if (!pointer.has(modalObj, path + '/' + ObjField + '/' + inputField)) {

            if (inputValue instanceof Object) {
                pointer.set(modalObj, path + '/' + ObjField + '/' + inputField, DeepCopy(inputValue))
            } else {
                pointer.set(modalObj, path + '/' + ObjField + '/' + inputField, inputValue)
            }

            pointer.remove(modalObj, path + '/' + ObjField + '/' + currentField)

        } else {
            return true
        }

        setRender(!render)

    }

    function focusOutField(inputValue) {
        if (ObjField !== inputValue)
            setObjField(ObjField)
    }

    // adds a child node
    function AddNode() {

        setHasEmptyField(false)

        if (!pointer.has(modalObj, path + '/' + ObjField + '/' + '')) {
            pointer.set(modalObj, path + '/' + ObjField + '/' + '', "")
            setRender(!render)
        } else {
            setHasEmptyField(true)
        }
    }

    // removes this component
    function removeList() {
        removeNode(modalObj, path, ObjField, isInArray)
        rerender()
    }

    return (
        <div>
            <div className={styles.modalContentContainer}>
                <div>

                    {!isInArray ?
                        <div>
                            <label className={styles.modalLabel}>Key</label>
                            <input value={ObjField} className={styles.modalInput} disabled={isRoot} onChange={(e) => {
                                changeField(e.target.value)
                            }} onBlur={(e) => {
                                focusOutField(e.target.value)
                            }}/>
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
                <div>
                    <label className={styles.modalLabel}>Type</label>
                    <select className={styles.modalInput} name={"type"} defaultValue={"object"} onChange={(e) => {
                        ChangeType(e.target.value)
                    }}>
                        {typeOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>

                </div>

                <div className={styles.modalNoLabel}>
                    {!(path === "" || isRoot || rerender === undefined) &&
                    <div className={styles.delButton}>
                        <i className={styles.removeIcon}
                           onClick={removeList}/>
                    </div>
                    }
                </div>
            </div>

            <div className={styles.addLine}>
                <div className={styles.nodeLine}><p/></div>

                <div>
                    <div>
                        {
                            Object.entries(pointer.get(modalObj, path + '/' + ObjField)).map(([key, value]) => {

                                return (
                                    <div className={styles.listContainer}
                                         key={path + '/' + field + '/' + key + '/' + render}>
                                        <div className={styles.listLine}/>

                                        <ModalObjectContainer modalObj={modalObj} field={key} value={value}
                                                              valueType={TypeOfValue(value)} isInArray={false}
                                                              path={path + '/' + ObjField} saveField={saveField}
                                                              rerender={() => {
                                                                  setRender(!render)
                                                              }}/>
                                    </div>
                                )
                            })
                        }
                    </div>

                    <div className={styles.nodePlusLineContainer}>
                        <div className={styles.nodePlusLine}/>
                        <div className={styles.addButton} >
                            <i className={styles.addIcon}
                               onClick={AddNode}/>
                        </div>
                        { hasEmptyField &&
                        <div className={styles.warning}><span>please insert a key value</span></div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}