export interface settingsData {
  tokenLength: number;
  idLength: number;
  saltLength: number;
  hashLength: number;
  loginDuration : number,
  oneTimeLoginDuration : number
}

export interface runtimeData {
  adminPasswordHash: string;
  adminSalt: string;
  settingsData : settingsData
}

export interface sessionTokenData{
  token : string
  admin : boolean,
  expiration : number,
  camPublicId? : string,
  email?: string
}

export interface loginData{
  admin : boolean,
  email? : string,
  passwordHash : string,
  oneTime : boolean
}

export interface createCamData{
  sessionToken: string, 
  email : string
}

export interface statusData{
  emailHashes : {emailHash : string, salt : string}[],
  settingsData : settingsData
}