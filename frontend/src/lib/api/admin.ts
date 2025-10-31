import { get } from "svelte/store";
import { adminData, currentSessionToken, IP, status } from "./stores";
import { removeCookie } from "typescript-cookie";
import { getUnixTime, isValidEmail } from "$lib/util/util";
import { getGeneralStatus } from "./network";
import type { createCamData, deleteCamData, editCamData } from "@classes";

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

    let resp: Response;
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

    if (resp.ok) {
        adminData.set(await resp.json());
    } else {
        throw await resp.text();
    }
}

export async function createCam(
    createData : createCamData
): Promise<string> {
    const curIP = get(IP);
    const curSessionToken = get(currentSessionToken);
    const curStatus = get(status);

    if (!curIP || !curSessionToken || !curStatus) {
        throw "an ip, a sessiontoken and a status (being connected to the server) is required to create a camera";
    }

    if (curSessionToken.expiration < getUnixTime()) {
        removeCookie("sessionToken");

        currentSessionToken.set(undefined);
        return "";
    }

    if (curSessionToken.admin == false) {
        throw "unathorized";
    }

    if(!isValidEmail(createData.email)){
        return "invalid email"
    }

    if(createData.address == ""){
        return "an address is needed"
    }

    let resp: Response;
    try {
        resp = await fetch(curIP + "createCam", {
            method: "POST",
            headers: { "Authorization": curSessionToken.token },
            body: JSON.stringify(createData),
        });
    } catch (error) {
        removeCookie("sessionToken");

        currentSessionToken.set(undefined);
        getGeneralStatus();
        return "";
    }

    if(!resp.ok){
        return resp.text()
    }

    getAdminData()

    return "";
}


export async function editCam(
    editData : editCamData
): Promise<string> {
    const curIP = get(IP);
    const curSessionToken = get(currentSessionToken);
    const curStatus = get(status);

    if (!curIP || !curSessionToken || !curStatus) {
        throw "an ip, a sessiontoken and a status (being connected to the server) is required to create a camera";
    }

    if (curSessionToken.expiration < getUnixTime()) {
        removeCookie("sessionToken");

        currentSessionToken.set(undefined);
        return "";
    }

    if (curSessionToken.admin == false) {
        throw "unathorized";
    }

    if(!isValidEmail(editData.email)){
        return "invalid email"
    }

    if(editData.address == ""){
        return "a new address is needed"
    }

    let resp: Response;
    try {
        resp = await fetch(curIP + "editCam", {
            method: "POST",
            headers: { "Authorization": curSessionToken.token },
            body: JSON.stringify(editData),
        });
    } catch (error) {
        removeCookie("sessionToken");

        currentSessionToken.set(undefined);
        getGeneralStatus();
        return "";
    }

    if(!resp.ok){
        return resp.text()
    }

    getAdminData()

    return "";
}

export async function deleteCam(
    deleteData : deleteCamData
): Promise<void> {
    const curIP = get(IP);
    const curSessionToken = get(currentSessionToken);
    const curStatus = get(status);

    if (!curIP || !curSessionToken || !curStatus) {
        throw "an ip, a sessiontoken and a status (being connected to the server) is required to delete a camera";
    }

    if (curSessionToken.expiration < getUnixTime()) {
        removeCookie("sessionToken");

        currentSessionToken.set(undefined);
        return;
    }

    if (curSessionToken.admin == false) {
        throw "unathorized";
    }

    if(!isValidEmail(deleteData.email)){
        throw "invalid email"
    }

    if(deleteData.publicId.length != curStatus.settingsData.idLength){
        throw "invalid id, lenght is not good"
    }


    let resp: Response;
    try {
        resp = await fetch(curIP + "deleteCam", {
            method: "DELETE",
            headers: { "Authorization": curSessionToken.token },
            body: JSON.stringify(deleteData),
        });
    } catch (error) {
        removeCookie("sessionToken");

        currentSessionToken.set(undefined);
        getGeneralStatus();
        return;
    }

    if(!resp.ok){
        throw resp.text()
    }

    getAdminData()

    return;
}
