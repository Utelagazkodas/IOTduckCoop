import { get } from "svelte/store";
import { currentSessionToken, IP, serverNotFound, status } from "./stores";
import { getCookie, removeCookie } from "typescript-cookie";
import type { sessionTokenData } from "$lib/util/classes";
import { getUnixTime, useIp } from "$lib/util/util";
import { checkSessionToken } from "./login";

export async function initApi() {
    // sets everything to default
    serverNotFound.set(false);
    IP.set(undefined);
    currentSessionToken.set(undefined);
    status.set(undefined);

    // gets ip
    IP.set(useIp(await (await fetch("/ip.txt", { method: "GET" })).text(), "http", "/"));

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
    const sessionCookie = getCookie("sessionToken");
    if (sessionCookie) {
        try {
            const sessionToken: sessionTokenData = JSON.parse(sessionCookie);
            if(sessionToken.expiration > getUnixTime()){
                checkSessionToken(sessionToken)
            }else{
                removeCookie("sessionToken")
            }
            
        } catch (error) {removeCookie("sessionToken")}
    }
}
