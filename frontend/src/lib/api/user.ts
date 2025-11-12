import { useIp } from "$lib/util/util";
import { get } from "svelte/store";
import { connectingWS, currentSessionToken, IP } from "./stores";
import type { Url } from "url";
import type { websocketCamAuth, websocketUserAuth } from "@classes";


export function connectWebsocket(){
    connectingWS.set(true)

    let curIp = get(IP)
    let sessionToken = get(currentSessionToken)

    if(!curIp || !sessionToken){
        throw "an ip and a session token is needed to be able to connect websocket"
    }

    if(sessionToken.admin){
        throw "an admin cant connect websocket"
    }

    let socket = new WebSocket(curIp.wsIp + "connect")

    socket.onopen = (ev) =>{
        let websocketAuth : websocketUserAuth = {sessionToken: sessionToken.token}
        socket.send(JSON.stringify(websocketAuth))
    }
}