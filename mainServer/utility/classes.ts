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

export interface sessionTokenData{
  token : string
  admin : boolean,
  expiration : number,
  camPublicId? : string,
  email?: string
} // THE DATA THAT WILL BE SAVED FOR EACH LOGIN

export interface loginData{
  admin : boolean,
  email? : string,
  passwordHash : string,
  oneTime : boolean
} // THE DATA THE CLIENT SEND THAT INDENTIFES THEM TO BE ELIGIBLE TO LOG IN

export interface createCamData{
  email : string
} // THE DATA THE ADMIN NEEDS TO SEND TO CREATE A CAMERA

export interface statusData{
  emailHashes : {emailHash : string, salt : string}[],
  settingsData : settingsData
} // THE DATA PUBLICLY AVAILABLE VIA THE PATH /STATUS

export interface createCamResponse{
  token : string
} // THE DATA SENT BACK TO THE ADMIN WHEN CREATING A CAMERA