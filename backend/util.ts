export function getUnixTime(): number {
    return Math.round(Date.now() / 1000)
}

export function getInANumber(promptText : string, min? : number, max? : number, whole : boolean = true) :number{
    let ret : number
    
    ret = Number(prompt(promptText))
}