import React, {useRef, useState} from "react";
import styles from "./styles.module.css"
import TypeToString from "./TypeToString";
import ValueToString from "./ValueToString";
import TypeOfValue from "./TypeOfValue";

/**
 * Displays nodes from JsonObject List
 * When a user clicks edit or add, calls Modal component
 *
 * @param input
 * @param indent
 * @param jsonPath
 * @param getOverlay
 * @param setOverlay
 * @param deleteNode
 * @param changeNode
 * @param needLeaf
 * @param createModal
 * @param jsonListOutput
 * @returns {JSX.Element|[]}
 * @constructor
 */
export default function DisplayJson(
    {
        input,
        indent,
        jsonPath,
        getOverlay,
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
                <div key={"undefined"}>Not JSON Format</div>
            </div>
        )
    } else if (needLeaf && (typeOfInput !== "object" || input === null)) {
        return (
            <div key={indent} className={styles.dataContainer}>
                <div className={styles.dataNode}>
                    <div className={styles.clickNode}>
                        <div style={{paddingLeft: indent + "em"}}/>
                        <DisplayJson jsonPath={jsonPath} input={input} indent={indent} needLeaf={false}/>

                        <div className={styles.rightContainer}>
                            <TypeToString input={input}/>
                            <div>
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
    } else if (input === null) {
        return (
            <div className={styles.valueData}>
                <ValueToString input={input}/>
            </div>
        )
    } else if (typeOfInput === "boolean") {
        return (
            <div className={styles.valueData}>
                <ValueToString input={input}/>
            </div>
        )
    } else if (typeOfInput === "string" || typeOfInput === "number") {
        return (
            <div className={styles.valueData}>
                <ValueToString input={input === "" ? '""' : input}/>
            </div>

        )
    } else if (JSON.stringify(input) === "{}" || JSON.stringify(input) === "[]") {

        return (
            <div key={indent} className={styles.dataContainer}>
                <div className={styles.dataNode}>
                    <div className={styles.clickNode}>
                        <div style={{paddingLeft: indent + "em"}}/>
                        <div className={styles.valueData}>
                            <span>{JSON.stringify(input)}</span>
                        </div>
                        <div className={styles.rightContainer}>
                            <TypeToString input={input}/>

                            <div>
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

    // input is either Object or an Array
    return (
        Object.entries(input).map(([key, value]) => {
            indexForKey = indexForKey + 1
            return (
                <DisplayNode key={jsonPath + key + indexForKey} field={key} value={value} indent={indent}
                             isInArray={input instanceof Array} jsonPath={jsonPath} getOverlay={getOverlay}
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
 *
 * @param field
 * @param value
 * @param indent
 * @param isInArray
 * @param jsonPath
 * @param getOverlay
 * @param setOverlay
 * @param deleteNode
 * @param changeNode
 * @param createModal
 * @param createEditModal
 * @param jsonListOutput
 * @returns {JSX.Element}
 *
 */
function DisplayNode({
                         field,
                         value,
                         indent,
                         isInArray,
                         jsonPath,
                         getOverlay,
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
                <div className={styles.clickNode}>
                    <div className={styles.keyData} style={{paddingLeft: indent + "em"}}>
                        {
                            isList &&
                            <div style={{display: "inline-block"}}>
                                <i className={showContent ? styles.arrowDown : styles.arrowRight} onClick={() => {
                                    setShowContent(!showContent)
                                }}/>
                            </div>
                        }

                        {isInArray && <div className={styles.arrayType}/>}
                        <span>{field}</span>
                    </div>

                    {/* shows type and edit and delete buttons on the right */}
                    <div className={styles.rightContainer}>
                        <div>[<TypeToString input={value}/>]</div>
                        <div className={styles.rightButton}>
                            <button type={"button"} onClick={() => {
                                setOverlay();
                                createEditModal(isList ? jsonPath + '/' + field : jsonPath, value, field, TypeOfValue(value), isInArray, isValueArray, isValueObject, inputRef);
                            }}>
                                {isList ? "Add" : "Edit"}
                            </button>
                        </div>
                        <div className={styles.rightButton}>
                            <button type={"button"} onClick={() => {
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
                <DisplayJson jsonPath={jsonPath + '/' + field} input={value} indent={indent + 1} getOverlay={getOverlay}
                             setOverlay={setOverlay} deleteNode={deleteNode} changeNode={changeNode} needLeaf={false}
                             createModal={createModal} createEditModal={createEditModal}
                             jsonListOutput={jsonListOutput}/>
            }

        </div>
    )
}