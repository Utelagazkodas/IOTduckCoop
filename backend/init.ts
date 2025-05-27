import { encode } from "node:punycode";
import {  getInAString, removeJSONcomments } from "./util.ts";
import {hash} from "@felix/bcrypt"
const env = await Deno.open("./.env", {write: true, create: true})
let settings : {PORT: number, SESSIONTOKENLENGTH : number, SESSIONTOKENLIFETIME : number, SALTLENGTH : number}

try {
    const settingsFile = await Deno.readTextFile("./settings.json")
    settings= JSON.parse(removeJSONcomments(settingsFile))
} catch (error) {
    console.error(error)
    throw "Either the settings.json doesnt exist, or it isnt valid json"
}

// checks if all the values exists
if(!settings.PORT || !settings.SESSIONTOKENLENGTH || !settings.SALTLENGTH || !settings.SESSIONTOKENLIFETIME){
    throw "The settings.json must contain values for PORT SESSIONTOKEN SALTLEGTH and SESSIONTOKENLIFETIME"
}

const passwordHash = await crypto.subtle.digest("SHA-512", new TextEncoder().encode(getInAString("What should be the password for the cam: ")))
console.log(passwordHash)