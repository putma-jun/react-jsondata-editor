/**
 * Returns deep copy of input
 *
 * @param input
 * @returns new value or object
 *
 */

export default function DeepCopy(input) {

    if(input === undefined){
        return undefined
    }else if (input === null){
        return null
    }else{
        return JSON.parse(JSON.stringify(input))
    }
}