import { generate } from "@alikia/random-key";
import { ONETIMETOKENLIFETIME, PASSWORDHASH, SESSIONTOKENLENGTH, SessionTokens, SESSIONTOKENLIFETIME } from "./main.ts";
import { getStatusData, getUnixTime, sessionToken } from "./util.ts";
import { toggleLight, turnCameraLeft, turnCameraRight } from "./interface.ts";
import { sleep } from "https://deno.land/x/sleep/mod.ts"


// URL PATTERNS
const loginPattern = new URLPattern({ pathname: "/login" });
const oneTimeLoginPattern = new URLPattern({ pathname: "/login/one-time" });
const logoutPattern = new URLPattern({pathname: "/logout"})
const logoutEverywherePattern = new URLPattern({ pathname: "/logoutEverywhere" });

const lightTogglePattern = new URLPattern({pathname: "/toggleLight"})

const turnCameraLeftPattern = new URLPattern({pathname: "/turnCameraLeft"})
const turnCameraRightPattern = new URLPattern({pathname: "/turnCameraRight"})

const connectToCamPattern = new URLPattern({pathname: "/connectCam"})


export async function post(
  req: Request,
  inf: Deno.ServeHandlerInfo<Deno.NetAddr>,
): Promise<Response> {
  // -------- LOGIN ENDPOINTS ---------
  const url = new URL(req.url);
  // long time login
  if (oneTimeLoginPattern.test(url) || loginPattern.test(url)) {
    let data: { passwordHash: string };

    try {
      data = JSON.parse(await req.text());
    } catch (_error) {
      return new Response("Bad JSON, for login", { status: 400 });
    }

    if (data.passwordHash == PASSWORDHASH) {
      const newSessionToken: sessionToken = {
        token: await generate(SESSIONTOKENLENGTH),
        expires: oneTimeLoginPattern.test(url)
          ? getUnixTime() + ONETIMETOKENLIFETIME
          : getUnixTime() + SESSIONTOKENLIFETIME,
      };


      SessionTokens.set(newSessionToken.token, newSessionToken)
      return new Response(JSON.stringify(newSessionToken));
    } else {
      return new Response("Password incorrect", { status: 401 });
    }
  }

  if (req.bodyUsed) {
    let data: sessionToken

    try {
      data = JSON.parse(await req.text());
    } catch (_error) {
      return new Response("Bad JSON, for non-login endpoint", { status: 400 });
    }

    // authenticates request
    if (
      !(SessionTokens.has(data.token))
    ) {
      return new Response(
        "Session token doesnt exist, or fingerprints dont match", {status: 401}
      );
    }
    else if(SessionTokens.get(data.token)!.expires < getUnixTime()){
      return new Response("Session token expired, and was deleted", {status: 401})
    }

    // if they want to logout
    if(logoutPattern.test(url)){
      SessionTokens.delete(data.token)
      return new Response("Session token deleted", {status: 205})
    }

    if (logoutEverywherePattern.test(url)) {
      SessionTokens.clear();
      return new Response("Session tokens cleared", {status: 205})
    }

    // LIGHT
    if(lightTogglePattern.test(url)){
      toggleLight()
      return new Response(JSON.stringify(getStatusData()), {status: 200})
    }

    // CAM MOVEMENT
    if(turnCameraLeftPattern.test(url)){
      turnCameraLeft()
      return new Response(JSON.stringify(getStatusData()), {status: 200})
    }

    if(turnCameraRightPattern.test(url)){
      turnCameraRight()
      return new Response(JSON.stringify(getStatusData()), {status: 200})
    }

    if(connectToCamPattern.test(url)){
      let {writable, readable} = new TransformStream()

      async()=>{
        sleep(1)
        writable.getWriter().write("asd")
      }

      return new Response(readable, {status: 200})
    }
  }
  return new Response("404, bad post request", { status: 404 });
}
