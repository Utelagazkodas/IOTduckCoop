import { handleRequest } from "./http.ts";
import { runtimeData } from "./utility/classes.ts";

export const runtimeData : runtimeData = JSON.parse(Deno.readTextFileSync("./database/data.json"))


Deno.serve(handleRequest)