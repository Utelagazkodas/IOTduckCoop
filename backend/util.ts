import { cameraPosition, cameraRange, cameraTurnRange, lightOn } from "./interface.ts";
import { SALT, SESSIONTOKENLENGTH, SESSIONTOKENLIFETIME, ONETIMETOKENLIFETIME } from "./main.ts";

export function getUnixTime(): number {
    return Math.round(Date.now() / 1000)
}

export function getInANumber(promptText: string, min?: number, max?: number, whole: boolean = true): number {
    let ret: number

    ret = Number(prompt(promptText))

    while (!ret || (min && ret < min) || (max && max < ret) || (ret % 1 != 0 && whole)) {
        if (!ret) {
            console.error("The input wasnt a number or there was a miscalenous error, try again")
            ret = Number(prompt(promptText))
            continue
        }
        if (min && ret < min) {
            console.error("The inputted number needs to be equal to or bigger than " + min)
            ret = Number(prompt(promptText))
            continue
        }
        if (max && max < ret) {
            console.error("The inputted number needs to be equal to or smaller than " + max)
            ret = Number(prompt(promptText))
            continue
        }
        if (ret % 1 != 0 && whole) {
            console.error("The inputted number needs to be whole")
            ret = Number(prompt(promptText))
            continue
        }
    }

    return ret
}

export function getInAString(promptText: string, minLength?: number, maxLength?: number): string {
    let ret: string | null

    ret = prompt(promptText)

    while (!ret || (minLength && ret.length < minLength) || (maxLength && maxLength < ret.length)) {
        if (!ret) {
            console.error("The input wasnt a number or there was a miscalenous error, try again")
            ret = prompt(promptText)
            continue
        }
        if (minLength && ret.length < minLength) {
            console.error("The input needs to be longer than " + minLength)
            ret = prompt(promptText)
            continue
        }
        if (maxLength && maxLength < ret.length) {
            console.error("The input needs to be shorter than " + maxLength)
            ret = prompt(promptText)
            continue
        }
    }

    return ret
}

export function removeJSONcomments(text : string) : string{
    let i = 0
    const ret = text.split("\n")

    
    while(i < ret.length){
        let j = 0
        while(j < ret[i].length -1){
            if(ret[i][j] == "/" && ret[i][j] == "/" ){
                ret[i] = ret[i].slice(0, j)
            }
            j += 1
        }
        i += 1
    }


    return ret.join("")
    
}

export function requireEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing required environment variable: ${name} \n You should init the project by running "deno task init"`);
  return value;
}



export function getStatusData() : statusData{
    return {cameraPosition: cameraPosition, lightOn: lightOn, salt: SALT, cameraRange: cameraRange, cameraTurnRange: cameraTurnRange, sessionTokenLength: SESSIONTOKENLENGTH, sessionTokenLifetime : SESSIONTOKENLIFETIME, oneTimeTokenLifetime: ONETIMETOKENLIFETIME}
}
// CLASSES


export interface sessionToken{
    expires : number,
    token : string
}

export interface statusData{
    salt : string,
    lightOn : boolean,
    cameraPosition : number,
    cameraRange : number,
    cameraTurnRange : number,
    sessionTokenLength : number,
    sessionTokenLifetime : number,
    oneTimeTokenLifetime : number
}

export interface loginData{
    passwordHash : string
}