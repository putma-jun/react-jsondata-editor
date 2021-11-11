import React, {useContext, useRef, useState} from "react";
import styles from "./lib/styles.module.css"
import TypeToString from "./lib/TypeToString";
import ValueToString from "./lib/ValueToString";
import TypeOfValue from "./lib/TypeOfValue";
import UserContext from "./UserContext";

/**
 * Displays nodes from the JSON Object
 * When a user clicks edit or add, calls createModal to create modal
 * JsonView - ViewNode are reclusive function
 *
 * @param input a JSON Object
 * @param jsonPath a current path
 * @param jsonListOutput indicates y-scroll
 * @param deleteNode delete an object from the JSON Object
 * @param setPrimitive changes a primitive value
 * @param createModal creates edit modal component
 * @param indent indentation
 * @param needLeaf indicates "", [] or {}

 * @returns {JSX.Element|[]}
 */
export default function JsonView(
    {
        input,
        jsonPath,
        jsonListOutput,
        deleteNode,
        setPrimitive,
        createModal,
        indent = 1,
        needLeaf = true,
    }) {

    const typeOfInput = TypeOfValue(input)
    const userStyle = useContext(UserContext)
    const [focusOnLine, setFocusOnLine] = useState(false)

    // modifies a primitive value
    function changePrimitive(inputText){
        setPrimitive(inputText, jsonListOutput.current.offsetTop + 32)
    }

    // saves information with current position node
    function createEditModal(jsonPath, field, value, isInArray, inputRef){
        createModal(jsonPath, field, value, isInArray, inputRef.current.offsetTop + inputRef.current.clientHeight - jsonListOutput.current.scrollTop)
    }

    if (input === undefined) {
        return (
            <div className={styles.nodeEmpty} style={{color: userStyle.values.string, fontFamily: userStyle.values.fontFamily}}>
                It doesn't have any data
            </div>
        )
    }else if (needLeaf && (typeOfInput !== "object" && typeOfInput !== "array" )) {
        return (
            <div key={indent} className={styles.dataContainer}>
                <div className={styles.dataNode} onClick={()=>{ changePrimitive(input)}}>
                    <div className={styles.needLeaf} style={{backgroundColor: focusOnLine ? userStyle.themes.hoverColor : ''}} onMouseOver={()=>{setFocusOnLine(true)}} onMouseLeave={()=>{setFocusOnLine(false)}}>
                        <div>
                            <JsonView jsonPath={jsonPath} input={input} indent={indent} needLeaf={false}/>
                        </div>
                        {focusOnLine &&
                        <div className={styles.rightContainer}
                             style={{backgroundImage: 'linear-gradient(to right, transparent 0, ' + userStyle.themes.hoverColor + ' 0.5em)'}}>
                            <div style={{
                                fontStyle: "italic",
                                color: userStyle.themes.color,
                                fontFamily: userStyle.values.fontFamily
                            }}><TypeToString input={input}/></div>
                            <div className={styles.rightButton}>
                                <button style={{
                                    backgroundColor: userStyle.buttons.delete,
                                    fontFamily: userStyle.values.fontFamily
                                }} type={"button"} onClick={() => {
                                    deleteNode(jsonPath)
                                }}> delete
                                </button>
                            </div>
                        </div>
                        }
                    </div>

                </div>
            </div>

        )
    } else if (typeOfInput === "null") {
        return (
            <div className={styles.valueData} style={{color: userStyle.values.null, fontFamily: userStyle.values.fontFamily}}>
                <ValueToString input={input}/>
            </div>
        )
    } else if (typeOfInput === "boolean") {
        return (
            <div className={styles.valueData} style={{color: userStyle.values.boolean, fontFamily: userStyle.values.fontFamily}}>
                <ValueToString input={input}/>
            </div>
        )
    } else if (typeOfInput === "number") {
        return (
            <div className={styles.valueData} style={{color: userStyle.values.number, fontFamily: userStyle.values.fontFamily}}>
                <ValueToString input={input === "" ? '""' : input}/>
            </div>

        )
    }else if(typeOfInput === "string" ){
        return (
            <div className={styles.valueData} style={{color: userStyle.values.string, fontFamily: userStyle.values.fontFamily}}>
                <ValueToString input={input === "" ? '""' : input}/>
            </div>

        )
    }else if(Object.keys(input).length === 0){
        return(
            <div className={styles.dataContainer}>
                <div className={styles.dataNode}>
                    <div className={styles.emptyObject} style={{backgroundColor: focusOnLine ? userStyle.themes.hoverColor : ''}} onMouseOver={()=>{setFocusOnLine(true)}} onMouseLeave={()=>{setFocusOnLine(false)}} >
                        <div style={{paddingLeft: indent + "em"}}>
                            <div className={styles.valueData} style={{paddingLeft: "12px", color: userStyle.values.string, fontFamily: userStyle.values.fontFamily}}>
                                <span>{JSON.stringify(input)}</span>
                            </div>
                        </div>
                        { focusOnLine &&
                        <div className={styles.rightContainer}
                             style={{backgroundImage: 'linear-gradient(to right, transparent 0, ' + userStyle.themes.hoverColor + ' 0.5em)'}}>
                            <div style={{
                                fontStyle: "italic",
                                color: userStyle.themes.color,
                                fontFamily: userStyle.values.fontFamily
                            }}><TypeToString input={input}/></div>
                            <div className={styles.rightButton}>
                                <button style={{
                                    backgroundColor: userStyle.buttons.delete,
                                    fontFamily: userStyle.values.fontFamily
                                }} type={"button"} onClick={() => {
                                    deleteNode(jsonPath)
                                }}> delete
                                </button>
                            </div>
                        </div>
                        }
                    </div>
                </div>
            </div>
        )

    }

    // input is either an Object or an Array
    return(
        Object.entries(input).map(([key, value]) => {

            return (
                <ViewNode key={jsonPath + "/" +key} jsonPath={jsonPath} field={key} value={value}
                          indent={indent} isInArray={input instanceof Array}
                          deleteNode={deleteNode} setPrimitive={setPrimitive} createModal={createModal} createEditModal={createEditModal}
                          jsonListOutput={jsonListOutput}/>
            )
        })
    )
}

/**
 * Creates node for json object
 * shows type and edit and delete buttons on the right
 *
 * @param jsonPath current path
 * @param field key
 * @param value value
 * @param jsonListOutput indicates y-scroll
 * @param indent indentation
 * @param isInArray indicates input is instanceof Array
 * @param deleteNode delete an object from the JSON Object
 * @param setPrimitive changes a primitive value
 * @param createModal creates edit modal component
 * @param createEditModal saves information with current position node of for modal editor when a user clicks add or edit button
 * @returns {JSX.Element}
 *
 */
function ViewNode({ jsonPath, field, value, jsonListOutput, indent, isInArray, deleteNode, setPrimitive, createModal, createEditModal}) {

    const [showContent, setShowContent] = useState(true)
    const [focusOnLine, setFocusOnLine] = useState(false)
    const isList = value instanceof Object
    // current clickNode position
    const inputRef = useRef()
    const userStyle = useContext(UserContext)

    return (
        <div className={styles.dataContainer}>
            <div className={styles.dataNode} ref={inputRef}>
                <div className={styles.clickNode}
                     style={{backgroundColor: focusOnLine ? userStyle.themes.hoverColor : ''}} onMouseOver={()=>{setFocusOnLine(true)}} onMouseLeave={()=>{setFocusOnLine(false)}}
                     onClick={(e)=>{
                    e.stopPropagation();
                    e.preventDefault();

                    if(isList) {
                        setShowContent(!showContent)
                    }else{
                        createEditModal(jsonPath, field, value, isInArray, inputRef)
                    }
                }}>
                    <div className={styles.keyData} style={{paddingLeft: indent + "em"}}>

                        <div style={isList ? {display : "inline-block"} :  { visibility : "hidden"  } }>
                            <i className={showContent ? styles.arrowDown : styles.arrowRight} />
                        </div>

                        {isInArray && <div className={styles.arrayType}/>}
                        <span style={{color: userStyle.key.color, fontFamily: userStyle.key.fontFamily}}>{field === '' ? '""' : field}</span>
                    </div>

                    { focusOnLine &&
                    <div className={styles.rightContainer} style={{backgroundImage: 'linear-gradient(to right, transparent 0, ' + userStyle.themes.hoverColor  + ' 0.5em)'}}>
                        <div style={{fontStyle:"italic", color:userStyle.themes.color, fontFamily: userStyle.values.fontFamily}}><TypeToString input={value}/></div>
                        <div className={styles.rightButton}>
                            <button style={{backgroundColor: userStyle.buttons.add, fontFamily: userStyle.values.fontFamily}} type={"button"} onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                createEditModal(jsonPath, field, value, isInArray, inputRef)
                            }}>
                                {isList ? "Add" : "Edit"}
                            </button>
                        </div>
                        <div className={styles.rightButton}>
                            <button style={{backgroundColor: userStyle.buttons.delete, fontFamily: userStyle.values.fontFamily}} type={"button"} onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                deleteNode(jsonPath + '/' + field)
                            }}> delete
                            </button>
                        </div>
                    </div>
                    }

                    {
                        !isList && <JsonView input={value} needLeaf={false}/>
                    }
                </div>

            </div>

            {
                isList && showContent &&
                <JsonView jsonPath={jsonPath + '/' + field} input={value} indent={indent + 1}
                             deleteNode={deleteNode} setPrimitive={setPrimitive} needLeaf={false}
                             jsonListOutput={jsonListOutput} createModal={createModal}/>
            }

        </div>
    )
}