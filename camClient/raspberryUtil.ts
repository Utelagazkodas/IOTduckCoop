import { doorState, lightState } from "@classes";

export let curDoorState : doorState = doorState.open
export let curLightState : lightState = lightState.on

export function toggleDoor(){
    if(curDoorState == doorState.noDoor){
        console.log("door doesnt exist, cant toggle")
    }

    else if(curDoorState == doorState.closed){
        console.log("opening door")
        curDoorState = doorState.opening
        // TODO
        setTimeout(()=>{
            curDoorState = doorState.open
        }, 4000)
    }
    else if(curDoorState == doorState.open){
        console.log("closing door")
        curDoorState = doorState.closing
        // TODO
        setTimeout(()=>{
            curDoorState = doorState.closed
        }, 4000)
    }
}   

export function toggleLights(){
    if(curLightState == lightState.noLight){
        console.log("light doesnt exist, cant toggle")
    }

    else if(curLightState == lightState.off){
        console.log("turning light on")
        curLightState = lightState.on
        // TODO

    }
    else if(curLightState == lightState.on){
        console.log("turning light off")
        curLightState = lightState.off
        // TODO
    }
}