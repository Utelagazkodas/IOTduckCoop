import { useIp } from "$lib/util/util";
import { get } from "svelte/store";
import {currentSessionToken, IP, WSData, WSState } from "./stores";
import type { Url } from "url";
import type { websocketCamAuth, websocketUserAuth } from "@classes";
import { WSStateData } from "$lib/util/frontendClasses";

export let disconnectWS : () => void = ()=>{}

export function connectWebsocket(){
    WSState.set(WSStateData.connecting)

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
        WSState.set(WSStateData.connected)
        let websocketAuth : websocketUserAuth = {sessionToken: sessionToken.token}
        socket.send(JSON.stringify(websocketAuth))
    }

    socket.onclose = (ev) =>{
        currentSessionToken.set(undefined)
        WSState.set(WSStateData.disconnected)
    }

    socket.onmessage = async (ev)=>{
        console.log(ev.data)
        WSData.set(await createImageBitmap(ev.data))
    }

    disconnectWS = ()=>{
        socket.close()
        disconnectWS = ()=>{}
    }
}