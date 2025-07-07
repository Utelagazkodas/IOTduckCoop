import { get } from "svelte/store";
import { adminData, currentSessionToken, IP, status } from "./stores";
import { removeCookie } from "typescript-cookie";
import { getUnixTime } from "$lib/util/util";
import { getGeneralStatus } from "./network";

export async function getAdminData(): Promise<void> {
    const curIP = get(IP);
    const curSessionToken = get(currentSessionToken);
    const curStatus = get(status);

    if (!curIP || !curSessionToken || !curStatus) {
        throw "an ip, a sessiontoken and a status (being connected to the server) is required to check the validity of your current token";
    }

    if (curSessionToken.expiration < getUnixTime()) {
        removeCookie("sessionToken");

        currentSessionToken.set(undefined);
        return;
    }

    if (curSessionToken.admin == false) {
        throw "unathorized";
    }

    let resp : Response
    try {
        resp = await fetch(curIP + "adminData", {
            method: "GET",
            headers: { "Authorization": curSessionToken.token },
        });
    } catch (error) {
        removeCookie("sessionToken");

        currentSessionToken.set(undefined);
        getGeneralStatus();
        return;
    }

    if(resp.ok){
        adminData.set(await resp.json())
    }
    else{
        throw await resp.text()
    }
}

export async function createCam(email : string, address : string) : Promise<string>{
    return ""
}