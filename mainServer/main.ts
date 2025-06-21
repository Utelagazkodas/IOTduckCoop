import { Database } from "@db/sqlite";
import { handleRequest } from "./http.ts";
import { runtimeData } from "./utility/classes.ts";
import {  requireEnv } from "./utility/util.ts";
import "@std/dotenv/load"

export const RUNTIMEDATA : runtimeData = JSON.parse(Deno.readTextFileSync("./database/data.json"))

export const PORT = Number(requireEnv("PORT"))

export const sessionTokenDB = await Deno.openKv("./database/sessionTokens.kv") 
export const camDB = new Database("./database/cam.db")

Deno.serve(handleRequest)

// handle closing the kv database on unload
globalThis.addEventListener("unload", ()=>{
 sessionTokenDB.close()
 camDB.close()
})

Deno.addSignalListener("SIGINT", () => {
    Deno.exit();
  });