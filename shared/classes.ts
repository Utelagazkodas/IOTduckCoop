export interface settingsData {
  tokenLength: number;
  idLength: number;
  saltLength: number;
  hashLength: number;
  loginDuration : number,
  oneTimeLoginDuration : number
} // USED WHEN CREATING THE DATABASE AND LOADING

export interface runtimeData {
  adminPasswordHash: string;
  adminSalt: string;
  settingsData : settingsData
} // ONLY USED IN THE SERVER FOR DATA THAT WILL BE LOADED DURING RUNTIME

export interface databaseType {
  token : string,
  publicId : string,
  salt : string,
  connected : boolean,
  email : string,
  emailHash : string,
  passwordHash : string,
  address : string
}

export interface sessionTokenData{
  token : string
  admin : boolean,
  expiration : number,
  camPublicId? : string,
  email?: string
} // THE DATA THAT WILL BE SAVED FOR EACH LOGIN, SENT OUT WHEN SOMEONE LOGS IN

export interface loginData{
  admin : boolean,
  email? : string,
  passwordHash : string,
  oneTime : boolean
} // THE DATA THE CLIENT SEND THAT INDENTIFES THEM TO BE ELIGIBLE TO LOG IN

export interface createCamData{
  email : string,
  address : string
} // THE DATA THE ADMIN NEEDS TO SEND TO CREATE A CAMERA

export interface statusData{
  adminSalt : string,
  emailHashes : {emailHash : string, salt : string, connected : boolean, publicId : string}[],
  settingsData : settingsData
} // THE DATA PUBLICLY AVAILABLE VIA THE PATH /STATUS


export interface cameraAdminData{
  token : string,
  publicId : string,
  salt : string,
  connected : boolean,
  email : string,
  emailHash : string,
  address : string
} // RETURNS AN ARRAY OF THESE ON /adminData WHEN AUTHORIZED AS ADMIN

export interface deleteCamData{
  publicId : string,
  email : string
} // THE DATA NEEDED TO REMOVE A CAMERA


export interface logoutData{
  everywhere : boolean
} // THE DATA NEEDED TO LOG OUT (/logout, method: DELETE), if everywhere is false it only removes that sessiontoken if true it removes every sessiontoken that is associated with that camera / admin, the token needs to be in the auth

export interface websocketCamAuth{
  token : string,
  passwordHash : string,
  publicId: string
}

export interface websocketUserAuth{
  sessionToken : string
}

export interface editCamData{
  publicId : string,
  email : string
  address : string
} // data needed to edit the infos of a camera, it will change the email and address to the one provided endpoint is /editCam POST an admin level auth token is to be provided

export interface WSRelay{
  // deno-lint-ignore no-explicit-any
  relay : any
} // if a cam sends this it sands it to every user, and if in reverse it sends it to the cam

export interface WSCamUpdate{
  address : string,
  email : string,
  emailHash : string,
  connectedUsers : number
} // sends this if the address/email changes or if someone connects or disconnects

export interface WSPasswordChange{
  passwordHash : string
} // a camera can sends this if it wants to change the password, it also disconnects every currently connected user