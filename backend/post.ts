import { generate } from "@alikia/random-key";
import { ONETIMETOKENLIFETIME, PASSWORDHASH, SESSIONTOKENLENGTH, SessionTokens, SESSIONTOKENLIFETIME } from "./main.ts";
import { fingerPrint, fingerPrintMatching, getStatusData, getUnixTime, sessionToken } from "./util.ts";
import { toggleLight, turnCameraLeft, turnCameraRight } from "./interface.ts";


// URL PATTERNS
const loginPattern = new URLPattern({ pathname: "/login" });
const oneTimeLoginPattern = new URLPattern({ pathname: "/login/one-time" });
const logoutPattern = new URLPattern({ pathname: "/logout" });

const lightTogglePattern = new URLPattern({pathname: "/toggleLight"})

const turnCameraLeftPattern = new URLPattern({pathname: "/turnCameraLeft"})
const turnCameraRightPattern = new URLPattern({pathname: "/turnCameraRight"})

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

      const newFingerPrint: fingerPrint = { ip: inf.remoteAddr.hostname };

      SessionTokens.set(newSessionToken.token, {
        sessionToken: newSessionToken,
        fingerPrint: newFingerPrint,
      });
      return new Response(JSON.stringify(newSessionToken));
    } else {
      return new Response("Password incorrect", { status: 401 });
    }
  }

  if (req.bodyUsed) {
    let data: { sessionToken: sessionToken };
    // deno-lint-ignore prefer-const
    let fingerPrint: fingerPrint = { ip: inf.remoteAddr.hostname };

    try {
      data = JSON.parse(await req.text());
    } catch (_error) {
      return new Response("Bad JSON, for non-login endpoint", { status: 400 });
    }

    // authenticates request
    if (
      !(SessionTokens.has(data.sessionToken.token) &&
        fingerPrintMatching(
          SessionTokens.get(data.sessionToken.token)?.fingerPrint!,
          fingerPrint,
        ))
    ) {
      return new Response(
        "Session token doesnt exist, or fingerprints dont match",
      );
    }

    // if they want to logout
    if (logoutPattern.test(url)) {
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
  }
  return new Response("404, bad post request", { status: 404 });
}
