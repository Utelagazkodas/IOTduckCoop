import {type cameraAdminData, type sessionTokenData, type statusData } from "$lib/util/classes";
import { writable } from "svelte/store";

// Svelte reactive stores
export const IP = writable<string | undefined>(undefined);
export const status = writable<statusData | undefined>(undefined);
export const serverNotFound = writable<boolean>(false);
export const currentSessionToken = writable<sessionTokenData | undefined>(
  undefined,
);

export const adminData = writable<cameraAdminData[] | undefined>(undefined)