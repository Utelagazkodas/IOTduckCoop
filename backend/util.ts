export function getUnixTime(): number {
    return Math.round(Date.now() / 1000)
}

export function getInANumber(promptText : string, min? : number, max? : number, whole : boolean = true) :number{
    let ret : number
    
    ret = Number(prompt(promptText))

    while(!ret || (min && ret < min) || (max && max < ret) || (ret%1 != 0  && whole)) {
        if(!ret){
            console.error("The input wasnt a number or there was a miscalenous error, try again")
            ret = Number(prompt(promptText))
            continue
        }
        if(min && ret < min){
            console.error("The inputted number needs to be bigger than "+ min )
            ret = Number(prompt(promptText))
            continue
        }
        if(max && max < ret){
            console.error("The inputted number needs to be bigger than "+ max )
            ret = Number(prompt(promptText))
            continue
        }
    }

    return ret
}