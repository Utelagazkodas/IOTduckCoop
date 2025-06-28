import { get, writable } from "svelte/store";
import type { loginData, sessionTokenData, statusData } from "./classes";
import { hash } from "./hash";
import { addSalt } from "./util";

// Svelte reactive stores
export const IP = writable<string | undefined>(undefined);
export const status = writable<statusData | undefined>(undefined);
export const serverNotFound = writable<boolean>(false)
export const currentSessionToken = writable<sessionTokenData | undefined>(
  undefined,
);

export async function initApi() {
  serverNotFound.set(false)
  IP.set(undefined)
  currentSessionToken.set(undefined)
  status.set(undefined)
  IP.set(await (await fetch("/ip.txt", { method: "GET" })).text());
  console.log(get(IP))
  try {
    let resp = await fetch(get(IP) + "status", { method: "GET" });
    const parsed = JSON.parse(await resp.text());
    status.set(parsed);
  } catch {
    serverNotFound.set(true)
    status.set(undefined);
  }
}

export async function logIn(password: string, email : string,oneTime: boolean = true) {
  const $status = get(status);
  const $IP = get(IP);

  if (!$IP || !$status) {
    throw "You need to establish a connection and have the IP to be able to log in";
  }

  // ADMIN LOGIN
  
  if(email == ""){
    oneTime = true
    const send : loginData= {admin: true, oneTime, passwordHash: hash(addSalt(password, $status.adminSalt), $status.settingsData.hashLength)}
    
  }
}
