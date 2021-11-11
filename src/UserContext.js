import {createContext} from "react";

/**
 * default themes
 * @type {React.Context<{themes: {color: string, hoverColor: string}, buttons: {add: string, cancel: string, update: string, delete: string}, values: {number: string, fontFamily: string, boolean: string, null: string, string: string}, banner: {fontFamily: string, color: string, hoverColor: string, fontColor: string}, key: {fontFamily: string, color: string}}>}
 */
const UserContext = createContext({
    themes: {
        color : '#9bb7d4',
        hoverColor : '#f4f7fa'
    },
    banner: {
        hoverColor: '#6690bd',
        fontColor : 'white',
        fontFamily: 'Arial, Helvetica, sans-serif'
    },
    key : {
        color : 'black',
        fontFamily: 'Arial, Helvetica, sans-serif'
    },
    values : {
        fontFamily: 'Arial, Helvetica, sans-serif',
        null : '#E9897E',
        boolean: '#8e4cad',
        number: '#25539a',
        string: '#797980'
    },
    buttons: {
        add: '#9bb7d4',
        delete: '#a0a2a4',
        update: '#9BB7D4',
        cancel: '#d49bb7',
    }

})


export default UserContext;