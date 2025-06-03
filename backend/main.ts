import "jsr:@std/dotenv/load";
import {
  requireEnv,
  sessionToken,
} from "./util.ts";
import { request } from "./http.ts";

// INIT ENV VARIABLES
export const SALT = requireEnv("SALT");
export const PORT = Number(requireEnv("PORT"));
export const SESSIONTOKENLENGTH = Number(requireEnv("SESSIONTOKENLENGTH"));
export const SESSIONTOKENLIFETIME = Number(requireEnv("SESSSIONTOKENLIFETIME"));
export const PASSWORDHASH = requireEnv("PASSWORDHASH");
export const ONETIMETOKENLIFETIME = Number(requireEnv("ONETIMETOKENLIFETIME"));


// INIT SESSION TOKEN MAP
export const SessionTokens: Map<
  string,
 sessionToken
> = new Map();


Deno.serve({ port: PORT }, request);
