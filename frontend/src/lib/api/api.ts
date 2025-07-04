import { get } from "svelte/store";
import { currentSessionToken, IP, serverNotFound, status } from "./stores";

export async function initApi() {
    // sets everything to default
    serverNotFound.set(false);
    IP.set(undefined);
    currentSessionToken.set(undefined);
    status.set(undefined);

    // gets ip
    IP.set(await (await fetch("/ip.txt", { method: "GET" })).text());

    // tries getting the status
    try {
        let resp = await fetch(get(IP) + "status", { method: "GET" });
        const parsed = JSON.parse(await resp.text());
        status.set(parsed);
    } catch {
        serverNotFound.set(true);
        status.set(undefined);
    }

    // checks for session token in cookies

}
