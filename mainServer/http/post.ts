import { generate } from "@alikia/random-key";
import { camDB, RUNTIMEDATA, sessionTokenDB } from "../main.ts";
import { createCamData, createCamResponse, loginData, sessionTokenData } from "../utility/classes.ts";

import {  getUnixTime, isValidEmail } from "../utility/util.ts";
import { hash } from "../hash.ts";

const loginUrlPattern = new URLPattern({ pathname: "/login" });

const createCamUrlPattern = new URLPattern({
  pathname: "/createCam",
});


export async function post(
  req: Request,
  inf: Deno.ServeHandlerInfo<Deno.NetAddr>,
  url: URL,
): Promise<Response> {
  // LOGIN
  if (loginUrlPattern.test(url)) {
    let data: loginData;
    try {
      data = JSON.parse(await req.text());
    } catch (_error) {
      return new Response("Bad json in body or no data", { status: 422 });
    }

    if (data.admin) {
      // handle errors and exceptions
      if (data.email) {
        return new Response(
          "if you are trying to log in as admin you cant have an email",
          { status: 403 },
        );
      }
      if (!data.oneTime) {
        return new Response(
          "if you are trying to log in as an admin you can only have a one time login", {status: 400}
        );
      }

      if (data.passwordHash != RUNTIMEDATA.adminPasswordHash) {
        return new Response("wrong password", { status: 401 });
      }
      // ADDS AN ADMIN SESSIONTOKEN

      const newSessionTokenData: sessionTokenData = {
        admin: true,
        expiration: RUNTIMEDATA.settingsData.oneTimeLoginDuration +
          getUnixTime(),
        token: await generate(RUNTIMEDATA.settingsData.tokenLength),
      };

      sessionTokenDB.set([newSessionTokenData.token], newSessionTokenData);
      return new Response(JSON.stringify(newSessionTokenData), {status: 200});
    } else {
      if (!data.email) {
        return new Response(
          "if you are not logging in as an admin an email is needed",
          { status: 401 },
        );
      }
      if (!isValidEmail(data.email)) {
        return new Response(
          "if you are not logging in as an admin a valid email is needed",
          { status: 401 },
        );
      }

      // ADDS A USER SESSION TOKEN

      const user = camDB.prepare("SELECT * FROM cameras WHERE passwordHash=?").all(data.passwordHash)[0]

      console.log(user)
      if(user){
        console.log("asd")
      }


    }
  }

  // CREATE CAM
  if (createCamUrlPattern.test(url)) {
    let data: createCamData;
    try {
      data = JSON.parse(await req.text());
    } catch (_error) {
      return new Response("Bad json in body or no data", { status: 422 });
    }
    const authTokenHeader =req.headers.get("Authorization")
    if(!authTokenHeader){
      return new Response("An 'Authorization' header is required")
    }
    
  
    const sessionToken : sessionTokenData = (await sessionTokenDB.get([authTokenHeader])).value as sessionTokenData

    if(sessionToken){
      if(sessionToken.expiration > getUnixTime()){
        if(!sessionToken.admin){
          return new Response("unathorized", {status: 401})
        }
        if(!data.email || !isValidEmail(data.email)){
          return new Response("invalid email", {status: 400})
        }

        // creates the data for the camera
        const salt = await generate(RUNTIMEDATA.settingsData.saltLength)
        const hashedEmail = hash(data.email, RUNTIMEDATA.settingsData.hashLength)
        const publicId = await generate(RUNTIMEDATA.settingsData.idLength)
        const token = await generate(RUNTIMEDATA.settingsData.tokenLength)

        // puts the data in the database
        camDB.exec(`INSERT INTO cameras (token, salt, emailHash, publicId, connected, email) VALUES (?, ?, ?, ?, false, ?)`, token, salt,  hashedEmail, publicId, data.email)
        console.log("created cam for email: "+ data.email)

        const resp : createCamResponse= {token} 
        return new Response(JSON.stringify(resp), {status: 200})
      }
      sessionTokenDB.delete([sessionToken.token])
    }
    return new Response("invalid sessionToken", {status: 498})

  }

  return new Response("Bad POST request", { status: 400 });
}
