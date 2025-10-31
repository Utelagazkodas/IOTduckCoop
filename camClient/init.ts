import { addSalt, getInANumber, getInAPassword, getInAString, requireEnv, useIp } from "./utility/util.ts";
import {statusData, databaseType} from "../shared/classes.ts"
import "@std/dotenv/load"
import { ensureDirSync, existsSync } from "@std/fs";
import {hash} from "../shared/hash.ts"


if (existsSync("./database")) {
  const resp = prompt(
    "Are you sure you want to continue? [y/N]\nA camera instance already exists, this operation is irreversible",
  )?.toLowerCase();

  if (!(resp == "y" || resp == "yes")) {
    Deno.exit();
  }
}

const IP = requireEnv("IP")
let status : statusData

try {
    status  = JSON.parse(await ((await fetch(useIp(IP, "http", "/status"))).text()))

    if(!status){
        throw "something went wrong"
    }
} catch (error) {

    throw "you need to connect to the server to be able to init"
    /* 
    const shouldProceed = confirm("Couldnt get a connection to the server, IT IS NOT ADVISED TO CONTINUE \n do you want to continue? ")

    if(!shouldProceed){
        throw "COULDNT CONNECT TO SERVER"
    }

    const jsonInput = confirm("Do you want to paste the server status information in as JSON? (otherwise its manual)")

    if(jsonInput){
        try {
                    status = JSON.parse(getInAString("Paste the JSON"))

        } catch (error) {
            throw "BAD JSON WHEN INPUTTING STATUS DATA"
        }
    }
    else{
        status = {adminSalt: "", emailHashes: [], settingsData : {hashLength : getInANumber("how long are the hashes configured to be?", 1, 100, true), idLength: getInANumber("how long are the ids configured to be?", 1, 1000, true), loginDuration: -1, oneTimeLoginDuration: -1, saltLength: getInANumber("how long are the salts configured to be?", 1, 1000, true), tokenLength: getInANumber("how long are the tokens configured to be?", 1, 1000, true)}}
    }*/

}

const token = getInAString("Paste in the token", status.settingsData.tokenLength, status.settingsData.tokenLength)
let data : databaseType

try {
    data  = JSON.parse(await(await fetch(useIp(IP, "http", "/cameraData"), {headers: [["token", token]]})).text())
} catch (error) {
    throw ["Something went wrong, the token was probably bad", error]
}



const passwordHash = hash(addSalt(getInAPassword("Password: ", 4), data.salt), status.settingsData.hashLength)

// removes the database
try {
  Deno.removeSync("./database", { recursive: true });
} catch (_error) { /**/ }

ensureDirSync("./database");

Deno.writeTextFile("./database/data.json", JSON.stringify({token: data.token, publicId : data.publicId, salt: data.salt}));

const kv = await Deno.openKv("./database/runtimeData.kv");

await kv.set(["passwordHash"], passwordHash)
await kv.set(["address"], data.address)
await kv.set(["email"], data.email)
await kv.set(["emailHash"], data.emailHash)

kv.close();