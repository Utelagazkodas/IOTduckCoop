

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

export interface websocketCamAuth{
  token : string,
  passwordHash : string
}

export interface websocketUserAuth{
  sessionToken : string
}