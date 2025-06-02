export let lightOn : boolean = false

export let cameraPosition : number = 0  // - => left + => right 
export const cameraRange : number = 4 // how many steps from the middle (0)

export const cameraTurnRange : number = 45 // how many degrees max rotation is


export function turnCameraLeft() : boolean{
        if( cameraPosition > -cameraRange){
        cameraPosition -= 1
        return true
    }
    return false
}

export function turnCameraRight() : boolean{
    if( cameraPosition < cameraRange){
        cameraPosition += 1
        return true
    }
    return false
}

export function toggleLight(){
    lightOn = !lightOn
}