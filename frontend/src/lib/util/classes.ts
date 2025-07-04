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
  emailHashes : {emailHash : string, salt : string, connected : boolean}[],
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