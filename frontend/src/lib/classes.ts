export interface sessionToken{
    expires : number,
    token : string
}

export interface statusData{
    salt : string,
    lightOn : boolean,
    cameraPosition : number,
    cameraRange : number,
    cameraTurnRange : number,
    sessionTokenLength : number,
    sessionTokenLifetime : number,
    oneTimeTokenLifetime : number
}