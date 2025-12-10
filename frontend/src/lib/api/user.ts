import { useIp } from "$lib/util/util";
import { get } from "svelte/store";
import {currentSessionToken, IP, WSData, WSState } from "./stores";
import type { Url } from "url";
import type { websocketCamAuth, websocketUserAuth, WSRelay, WSToggle } from "@classes";
import { WSStateData } from "$lib/util/frontendClasses";

export let disconnectWS : () => void = ()=>{}

let WSSocket : WebSocket | null = null

export function connectWebsocket(){
    WSState.set(WSStateData.connecting)
    WSSocket = null

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
        WSSocket= socket
        WSState.set(WSStateData.connected)
        let websocketAuth : websocketUserAuth = {sessionToken: sessionToken.token}
        socket.send(JSON.stringify(websocketAuth))
    }

    socket.onclose = (ev) =>{
        currentSessionToken.set(undefined)
        WSSocket = null
        WSState.set(WSStateData.disconnected)
    }

    socket.onmessage = async (ev)=>{
        if(typeof ev.data != "string"){
            let message = new Uint8Array(await ev.data.arrayBuffer())
            console.log(message[0], message[1])

            let image = message.slice(2)
            WSData.set({image: await createImageBitmap(new Blob([image])), doorState: message[0], lightState: message[1]})
        }

    }

    disconnectWS = ()=>{
        socket.close()
        disconnectWS = ()=>{}
    }
}

export function toggleDoor(){
    let curWSState = get(WSState)
    
    if(!(curWSState == WSStateData.connected && WSSocket)){
        throw "you need to be connected to toggle door"
    }

    let toggleDoor : WSToggle = {toggleDoor: true, toggleLight: false}
    let toSend : WSRelay = {relay: toggleDoor}
    WSSocket.send(JSON.stringify(toSend))
}

export function toggleLight(){
    let curWSState = get(WSState)
    
    if(!(curWSState == WSStateData.connected && WSSocket)){
        throw "you need to be connected to toggle door"
    }

    let toggleDoor : WSToggle = {toggleDoor: false, toggleLight: true}
    let toSend : WSRelay = {relay: toggleDoor}
    WSSocket.send(JSON.stringify(toSend))
}