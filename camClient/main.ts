import "@std/dotenv/load"
import { requireEnv, useIp } from "./utility/util.ts";
import { databaseType, statusData, websocketCamAuth, WSCamUpdate, WSRelay } from "../shared/classes.ts";
import * as canv from "@gfx/canvas"

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

let connectedUsers = 0

ws.onopen = async (event) => {
    const auth : websocketCamAuth = {passwordHash: ((await runtimeKv.get(["passwordHash"])).value)  as string, token: RUNTIMEDATA.token, publicId: RUNTIMEDATA.publicId}
    
    ws.send(JSON.stringify(auth))
}

ws.onmessage = async (event : MessageEvent) => {
    const data : WSCamUpdate = JSON.parse(event.data)

    console.log(data)

    connectedUsers = data.connectedUsers
}

ws.onclose = async (event : CloseEvent) =>{
    console.log("closed", event.reason)
}

const data = await Deno.readFile("./test.jpg");
const blob = new Blob([data], { type: "image/jpeg" });

setInterval(()=>{
    if(connectedUsers > 0){
        const relay : WSRelay = {relay :  "1"}
        ws.send(blob)
    }
}, 1000) 



