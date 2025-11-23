import { WSStateData } from "$lib/util/frontendClasses";
import {doorState, lightState, type cameraAdminData, type sessionTokenData, type statusData } from "@classes";
import { writable } from "svelte/store";

// Svelte reactive stores
export const IP = writable<{httpIp : string, wsIp: string} | undefined>(undefined);
export const status = writable<statusData | undefined>(undefined);
export const serverNotFound = writable<boolean>(false);
export const currentSessionToken = writable<sessionTokenData | undefined>(
  undefined,
);

// admin stores
export const adminData = writable<cameraAdminData[] | undefined>(undefined)

// user stores
export const WSState = writable<WSStateData>(WSStateData.disconnected)

export const WSData = writable<{image : ImageBitmap, doorState : doorState, lightState : lightState} | null>(null)