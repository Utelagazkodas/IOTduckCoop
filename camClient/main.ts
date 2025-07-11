import "@std/dotenv/load"
import { requireEnv, useIp } from "./utility/util.ts";
import { databaseType, statusData, websocketCamAuth } from "./utility/classes.ts";

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

export const RUNTIMEDATA : databaseType = JSON.parse(Deno.readTextFileSync("./database/data.json"))

export const runtimeKv = await Deno.openKv("./database/runtimeData.kv");

export const ws = new WebSocket(useIp(IP, "ws", "/connect"))

ws.onopen = async (event) => {
    let auth : websocketCamAuth = {passwordHash: ((await runtimeKv.get(["passwordHash"])).value)  as string, token: RUNTIMEDATA.token}
    
    ws.send(JSON.stringify(auth))
}