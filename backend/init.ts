import { generate } from "@alikia/random-key";
import {  getInAString, removeJSONcomments } from "./util.ts";
import { encodeHex } from "@std/encoding/hex";
const env = await Deno.open("./.env", {write: true, create: true})
let settings : {PORT: number, SESSIONTOKENLENGTH : number, SESSIONTOKENLIFETIME : number, SALTLENGTH : number, ONETIMETOKENLIFETIME : number}

try {
    const settingsFile = await Deno.readTextFile("./settings.json")
    settings= JSON.parse(removeJSONcomments(settingsFile))
} catch (error) {
    console.error(error)
    throw "Either the settings.json doesnt exist, or it isnt valid json, or (most likely) doesnt contain all the necessarry data (PORT, SESSIONTOKEN, SALTLENGTH, SESSIONTOKENLIFETIME, ONETIMETOKENLIFETIME)"
}

// checks if all the values exists
if(!settings.PORT || !settings.SESSIONTOKENLENGTH || !settings.SALTLENGTH || !settings.SESSIONTOKENLIFETIME || !settings.ONETIMETOKENLIFETIME){
    throw "The settings.json must contain values for PORT SESSIONTOKEN SALTLEGTH SESSIONTOKENLIFETIME and ONETIMETOKENLIFETIME"
}

const salt = await generate(settings.SALTLENGTH)

const password = getInAString("What should be the password for the cam: ", 8)

const passwordHash = encodeHex( await crypto.subtle.digest("SHA-512", new TextEncoder().encode(salt + password + salt)))

env.write(new TextEncoder().encode(`SALT="${salt}" \nPORT=${settings.PORT} \nSESSIONTOKENLENGTH=${settings.SESSIONTOKENLENGTH} \nSESSSIONTOKENLIFETIME=${settings.SESSIONTOKENLIFETIME} \nPASSWORDHASH=${passwordHash} \nONETIMETOKENLIFETIME=${settings.ONETIMETOKENLIFETIME}`))