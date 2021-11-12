import {createContext} from "react";

/**
 *
 * @type {React.Context<{themes: {color: string, hoverColor: string}, buttons: {add: string, cancel: string, update: string, delete: string}, values: {number: string, boolean: string, null: string, string: string, font: string}, banner: {hoverColor: string, fontColor: string, font: string}, key: {color: string, font: string}}>}
 */
const UserContext = createContext({
    themes: {
        color : '#9bb7d4',
        hoverColor : '#f4f7fa'
    },
    banner: {
        hoverColor: '#6690bd',
        fontColor : 'white',
        font: '20px/30px Arial, Helvetica, sans-serif'
    },
    key : {
        color : 'black',
        font: '16px/26px Arial, Helvetica, sans-serif'
    },
    values : {
        font: '14px/26px Arial, Helvetica, sans-serif',
        null : '#E9897E',
        boolean: '#8e4cad',
        number: '#25539a',
        string: '#797980'
    },
    buttons: {
        add: '#9bb7d4',
        delete: '#a0a2a4',
        update: '#9BB7D4',
        cancel: '#d49bb7'
    }

})


export default UserContext;