import React, {useRef, useState} from "react";
import styles from "./styles.module.css"
import TypeToString from "./TypeToString";
import ValueToString from "./ValueToString";
import TypeOfValue from "./TypeOfValue";

/**
 * Displays nodes from the JSON Object
 * When a user clicks edit or add, calls createModal to create modal
 * DisplayJson - DisplayNode are reclusive function
 *
 * @param input a JSON Object
 * @param indent indentation
 * @param jsonPath a current path
 * @param setOverlay sets Overlay
 * @param deleteNode delete an object from the JSON Object
 * @param changeNode modifies the JSON Object
 * @param needLeaf indicates "", [] or {}
 * @param createModal creates edit modal component
 * @param jsonListOutput indicates y-scroll
 * @returns {JSX.Element|[]}
 */
export default function DisplayJson(
    {
        input,
        indent,
        jsonPath,
        setOverlay,
        deleteNode,
        changeNode,
        needLeaf = true,
        createModal,
        jsonListOutput
    }) {

    const typeOfInput = typeof input
    let indexForKey = 0

    // saves information with current position node of for modal editor when a user clicks add or edit button
    function createEditModal(jsonPath, value, field, type, isInArray, isValueArray, isValueObject, inputRef) {
        createModal(jsonPath, value, field, type, isInArray, isValueArray, isValueObject, inputRef.current.offsetTop + inputRef.current.clientHeight - jsonListOutput.current.scrollTop)
    }

    if (input === undefined) {
        return (
            <div className={styles.valueData}>
                <div key={"undefined"}>It is not JSON Format</div>
            </div>
        )
    }else if (needLeaf && (typeOfInput !== "object" || input === null)) {
        return (
            <div key={indent} className={styles.dataContainer}>
                <div className={styles.dataNode}>
                    <div className={styles.clickNode}>
                        <div style={{paddingLeft: indent + "em"}}/>
                        <DisplayJson jsonPath={jsonPath} input={input} indent={indent} needLeaf={false}/>

                        <div className={styles.rightContainer}>
                            <div className={styles.rightType}><TypeToString input={input}/></div>
                            <div className={styles.rightButton}>
                                <button type={"button"} onClick={() => {
                                    deleteNode(jsonPath)
                                }}> delete
                                </button>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

        )
    } else if(needLeaf && Object.keys(input).length === 0){
        return(
            <div className={styles.nodeEmpty}>
                It doesn't have any data
            </div>
        )
    }else if (input === null) {
        return (
            <div className={styles.nullValue}>
                <ValueToString input={input}/>
            </div>
        )
    } else if (typeOfInput === "boolean") {
        return (
            <div className={styles.booleanValue}>
                <ValueToString input={input}/>
            </div>
        )
    } else if (typeOfInput === "number") {
        return (
            <div className={styles.numberValue}>
                <ValueToString input={input === "" ? '""' : input}/>
            </div>

        )
    }else if(typeOfInput === "string" ){
        return (
            <div className={styles.valueData}>
                <ValueToString input={input === "" ? '""' : input}/>
            </div>

        )
    } else if (Object.keys(input).length === 0){
        return (
            <div key={indent} className={styles.dataContainer}>
                <div className={styles.dataNode}>
                    <div className={styles.clickNode}>
                        <div style={{paddingLeft: indent + "em"}}/>
                        <div className={styles.valueData}>
                            <span>{JSON.stringify(input)}</span>
                        </div>
                        <div className={styles.rightContainer}>
                            <div className={styles.rightType}><TypeToString input={input}/></div>
                            <div className={styles.rightButton}>
                                <button type={"button"} onClick={() => {
                                    deleteNode(jsonPath)
                                }}> delete
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        )
    }

    // input is either an Object or an Array
    return (
        Object.entries(input).map(([key, value]) => {
            indexForKey = indexForKey + 1
            return (
                <DisplayNode key={jsonPath + key + indexForKey} field={key} value={value} indent={indent}
                             isInArray={input instanceof Array} jsonPath={jsonPath}
                             setOverlay={setOverlay} deleteNode={deleteNode} changeNode={changeNode}
                             createModal={createModal}
                             createEditModal={(jsonPath, value, field, type, isInArray, isValueArray, isValueObject, inputRef) => {
                                 createEditModal(jsonPath, value, field, type, isInArray, isValueArray, isValueObject, inputRef)
                             }} jsonListOutput={jsonListOutput}/>
            )
        })
    )
}

/**
 * Creates view for json object
 * shows type and edit and delete buttons on the right
 *
 *
 * @param field key
 * @param value value
 * @param indent indentation
 * @param isInArray indicates input is instanceof Array
 * @param jsonPath current path
 * @param setOverlay sets Overlay
 * @param deleteNode delete an object from the JSON Object
 * @param changeNode modify the JSON Object
 * @param createModal creates edit modal component
 * @param createEditModal saves information with current position node of for modal editor when a user clicks add or edit button
 * @param jsonListOutput indicates y-scroll
 * @returns {JSX.Element}
 *
 *
 */
function DisplayNode({
                         field,
                         value,
                         indent,
                         isInArray,
                         jsonPath,
                         setOverlay,
                         deleteNode,
                         changeNode,
                         createModal,
                         createEditModal,
                         jsonListOutput
                     }) {

    const [showContent, setShowContent] = useState(true)
    const inputRef = useRef()

    const isValueArray = value instanceof Array
    const isValueObject = value instanceof Object
    const isList = isValueObject || isValueArray

    return (
        <div className={styles.dataContainer}>
            <div className={styles.dataNode} ref={inputRef}>
                <div className={styles.clickNode} onClick={(e)=>{
                    e.stopPropagation()
                    e.preventDefault()
                    if(isList) {
                        setShowContent(!showContent)
                    }else{
                        setOverlay()
                        createEditModal(isList ? jsonPath + '/' + field : jsonPath, value, field, TypeOfValue(value), isInArray, isValueArray, isValueObject, inputRef)
                    }
                }}>
                    <div className={styles.keyData} style={{paddingLeft: indent + "em"}}>

                        <div style={isList ? {display : "inline-block"} :  { visibility : "hidden"  } }>
                            <i className={showContent ? styles.arrowDown : styles.arrowRight} />
                        </div>

                        {isInArray && <div className={styles.arrayType}/>}
                        <span>{field}</span>
                    </div>

                    {/* shows type and edit and delete buttons on the right */}
                    <div className={styles.rightContainer}>
                        <div className={styles.rightType}><TypeToString input={value}/></div>
                        <div className={styles.rightButton}>
                            <button type={"button"} onClick={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                                setOverlay();
                                createEditModal(isList ? jsonPath + '/' + field : jsonPath, value, field, TypeOfValue(value), isInArray, isValueArray, isValueObject, inputRef);
                            }}>
                                {isList ? "Add" : "Edit"}
                            </button>
                        </div>
                        <div className={styles.rightButton}>
                            <button type={"button"} onClick={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                                deleteNode(jsonPath + '/' + field)
                            }}> delete
                            </button>
                        </div>
                    </div>

                    {
                        !isList &&
                        <DisplayJson jsonPath={jsonPath + '/' + field} input={value} indent={indent} needLeaf={false}/>
                    }
                </div>

            </div>

            {
                isList && showContent &&
                <DisplayJson jsonPath={jsonPath + '/' + field} input={value} indent={indent + 1}
                             setOverlay={setOverlay} deleteNode={deleteNode} changeNode={changeNode} needLeaf={false}
                             createModal={createModal} createEditModal={createEditModal}
                             jsonListOutput={jsonListOutput}/>
            }

        </div>
    )
}