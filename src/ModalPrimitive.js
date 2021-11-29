import React, {useContext, useState} from "react";
import styles from "./lib/styles.module.css";
import UserContext from "./UserContext";

/**
 * Creates a modal when a user click JSON  primitive value
 *
 * @param primitiveValue value
 * @param savePrimitive modifies value
 * @returns {JSX.Element}
 */
export default function ModalPrimitive({primitiveValue, savePrimitive}) {

    const [inputValue, setInputValue] = useState(primitiveValue)
    const userStyle = useContext(UserContext)

    return (
        <div key={"ModalEditor"} className={styles.modalContainer}>
            <form onSubmit={(e) => {
                e.preventDefault();
                savePrimitive(inputValue === null ? "null" : inputValue)
            }}>

                <div>
                    <label className={styles.modalLabel} style={{font:userStyle.key.font}}>Value</label>
                    <input value={inputValue === null ? "null" : inputValue} className={styles.primitiveInput} onChange={(e) => {
                        setInputValue(e.target.value)
                    }}/>
                </div>

                <div style={{float: "right"}}>
                    <div className={styles.modalBtnContainer}>
                        <div className={styles.modalModifyBtnContainer} >
                            <button  type={"button"} className={styles.modalButton} style={{backgroundColor:userStyle.buttons.cancel}}
                                    onClick={() => {
                                        savePrimitive()
                            }}> <span style={{font:userStyle.values.font, lineHeight:"normal"}}>Cancel</span></button>
                            <button type={"submit"} className={styles.modalButton} style={{backgroundColor:userStyle.buttons.update}}>
                                <span style={{font:userStyle.values.font, lineHeight:"normal"}}>Update</span></button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
