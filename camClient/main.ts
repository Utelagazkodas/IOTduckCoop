import "@std/dotenv/load"
import { requireEnv } from "./utility/util.ts";

export const PORT = Number(requireEnv("PORT"))
export const WSIP = requireEnv("WSIP")
