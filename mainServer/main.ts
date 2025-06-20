import { handleRequest } from "./http.ts";
import { runtimeData } from "./utility/classes.ts";
import { requireEnv } from "./utility/util.ts";

export const RUNTIMEDATA : runtimeData = JSON.parse(Deno.readTextFileSync("./database/data.json"))

export const PORT = Number(requireEnv("PORT"))


Deno.serve(handleRequest)