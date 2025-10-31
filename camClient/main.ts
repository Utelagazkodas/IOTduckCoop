import "@std/dotenv/load"
import { requireEnv, useIp } from "./utility/util.ts";
import { databaseType, statusData, websocketCamAuth } from "../shared/classes.ts";

export const PORT = Number(requireEnv("PORT"))
export const IP = requireEnv("IP")
export let status : statusData

try {
    status  = JSON.parse(await ((await fetch(useIp(IP, "http", "/status"))).text()))

    if(!status){
        throw "something went wrong"
    }
} catch (error) {

    throw "the server might not be running"
}

export const RUNTIMEDATA : {token: string, publicId:string, salt : string} = JSON.parse(Deno.readTextFileSync("./database/data.json"))

export const runtimeKv = await Deno.openKv("./database/runtimeData.kv");

export const ws = new WebSocket(useIp(IP, "ws", "/connect"))

console.log()

ws.onopen = async (event) => {
    let auth : websocketCamAuth = {passwordHash: ((await runtimeKv.get(["passwordHash"])).value)  as string, token: RUNTIMEDATA.token, publicId: RUNTIMEDATA.publicId}
    
    ws.send(JSON.stringify(auth))
}

ws.onmessage = async (event : MessageEvent) => {
    const data : databaseType = JSON.parse(event.data)

    
}

ws.onclose = async (event : CloseEvent) =>{
    console.log("closed", event.reason)
}