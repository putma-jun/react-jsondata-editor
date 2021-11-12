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

                <div className={styles.modalInputContainer}>
                    <label className={styles.modalLabel} style={{fontFamily:userStyle.key.fontFamily}}>Value</label>
                    <input value={inputValue === null ? "null" : inputValue} className={styles.primitiveInput} onChange={(e) => {
                        setInputValue(e.target.value)
                    }}/>
                </div>

                <div style={{float: "right"}}>
                    <div className={styles.modalBtnContainer}>
                        <div className={styles.modalModifyBtnContainer}>
                            <button type={"button"} className={styles.modalButton} style={{fontFamily:userStyle.values.fontFamily, backgroundColor:userStyle.buttons.cancel}}
                                    onClick={() => {
                                        savePrimitive()
                            }}> Cancel
                            </button>
                            <button type={"submit"} className={styles.modalButton} style={{fontFamily:userStyle.values.fontFamily, backgroundColor:userStyle.buttons.update}}>Update</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
