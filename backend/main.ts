import "jsr:@std/dotenv/load";
import {
  fingerPrint,
  fingerPrintMatching,
  getUnixTime,
  requireEnv,
  sessionToken,
} from "./util.ts";
import { generate } from "@alikia/random-key";

const SALT = requireEnv("SALT");
const PORT = Number(requireEnv("PORT"));
const SESSIONTOKENLENGTH = Number(requireEnv("SESSIONTOKENLENGTH"));
const SESSSIONTOKENLIFETIME = Number(requireEnv("SESSSIONTOKENLIFETIME"));
const PASSWORDHASH = requireEnv("PASSWORDHASH");
const ONETIMETOKENLIFETIME = Number(requireEnv("ONETIMETOKENLIFETIME"));


console.log(PASSWORDHASH)
const SessionTokens: Map<
  string,
  { sessionToken: sessionToken; fingerPrint: fingerPrint }
> = new Map();

// URL PATTERNS
const loginPattern = new URLPattern({ pathname: "/login" });
const oneTimeLoginPattern = new URLPattern({ pathname: "/login/one-time" });

const logoutPattern = new URLPattern({ pathname: "/logout" });

const statusPattern = new URLPattern({ pathname: "/status" });

Deno.serve({ port: PORT }, async (req, info) => {
  const url = new URL(req.url);

  // -------- LOGIN ENDPOINTS ---------

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
          : getUnixTime() + SESSSIONTOKENLIFETIME,
      };

      const newFingerPrint: fingerPrint = { ip: info.remoteAddr.hostname };

      SessionTokens.set(newSessionToken.token, {
        sessionToken: newSessionToken,
        fingerPrint: newFingerPrint,
      });
      return new Response(JSON.stringify(newSessionToken));
    } else {
      return new Response("Password incorrect", { status: 401 });
    }
  }

  // status
  if (statusPattern.test(url)) {
    const data: { salt: string } = { salt: SALT };

    return new Response(JSON.stringify(data), { status: 200 });
  }

  if (req.bodyUsed) {
    let data: { sessionToken: sessionToken };
    // deno-lint-ignore prefer-const
    let fingerPrint: fingerPrint = { ip: info.remoteAddr.hostname };

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
    if(logoutPattern.test(url)){
      SessionTokens.clear()
    }
  }

  return new Response("404, endpoint probably doesnt exist, or you need to have a sessiontoken in the body", { status: 404 });
});
