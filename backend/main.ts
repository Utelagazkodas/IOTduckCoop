import "jsr:@std/dotenv/load";
import { fingerPrint, requireEnv, sessionToken } from "./util.ts";
import { generate } from "@alikia/random-key";


const SALT = requireEnv("SALT");
const PORT = Number(requireEnv("PORT"));
const SESSIONTOKENLENGTH = Number(requireEnv("SESSIONTOKENLENGTH"));
const SESSSIONTOKENLIFETIME = Number(requireEnv("SESSSIONTOKENLIFETIME"));
const PASSWORDHASH = requireEnv("PASSWORDHASH");
const ONETIMETOKENLIFETIME = Number(requireEnv("ONETIMETOKENLIFETIME"));

const SessionTokens: { [key: string]: {sessionToken : sessionToken, fingerPrint : fingerPrint} } = {};

// URL PATTERNS
const loginPattern = new URLPattern({ pathname: "/login" });
const oneTimeLoginPattern = new URLPattern({ pathname: "/login/one-time" })

const statusPattern = new URLPattern({pathname: "/status"})

Deno.serve({ port: PORT }, async (req, info) => {
  const url = new URL(req.url);

  // -------- LOGIN ENDPOINTS ---------

  // long time login
  if(oneTimeLoginPattern.test(url) || loginPattern.test(url)){
    let data : {passwordHash : string,}

    try {
      data = JSON.parse(await req.text())
    } catch (_error) {
      return new Response("Bad JSON", {status: 400})
    }

    if(data.passwordHash == PASSWORDHASH){
      let newSessionToken : sessionToken = {token: await generate(SESSIONTOKENLENGTH), expires : oneTimeLoginPattern.test(url) ? ONETIMETOKENLIFETIME : SESSSIONTOKENLIFETIME}

      let newFingerPrint :fingerPrint = {ip: info.remoteAddr.hostname}

      SessionTokens[newSessionToken.token] = {sessionToken: newSessionToken, fingerPrint : newFingerPrint}
      return new Response()
    }else{
      return new Response("Password incorrect", {status: 401})
    }
  }

  // status 
  if(statusPattern.test(url)){
    const data : {salt : string} = {salt : SALT}

    return new Response(JSON.stringify(data), {status: 200})
  }

  return new Response("404, endpoint probably doesnt exist", { status: 404 });
});
