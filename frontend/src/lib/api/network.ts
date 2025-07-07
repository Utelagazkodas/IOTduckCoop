import { get } from "svelte/store";
import { IP, serverNotFound, status } from "./stores";

export async function getGeneralStatus() {
  try {
    let resp = await fetch(get(IP) + "status", { method: "GET" });
    const parsed = JSON.parse(await resp.text());
    status.set(parsed);
  } catch {
    serverNotFound.set(true);
    status.set(undefined);
  }
}