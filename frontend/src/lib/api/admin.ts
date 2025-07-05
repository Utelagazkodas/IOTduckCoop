import { get } from "svelte/store";
import { currentSessionToken, IP, status } from "./stores";
import { removeCookie } from "typescript-cookie";
import { getUnixTime } from "$lib/util/util";

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
}
