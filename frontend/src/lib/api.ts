import { get, writable } from "svelte/store";
import type { sessionToken, statusData } from "./classes";

// Svelte reactive stores
export const IP = writable<string | undefined>(undefined);
export const status = writable<statusData | undefined>(undefined);
export const currentSessionToken = writable<sessionToken | undefined>(
  undefined,
);
export const foundServer = writable<boolean | undefined>(undefined);

export async function initApi(ip?: string) {
  let finalIP: string;

  if (!ip) {
    try {
      finalIP = await (await fetch("/ip.txt", { method: "GET" })).text();
    } catch (error) {
      status.set(undefined);
      IP.set(undefined);
      foundServer.set(false);
      return;
    }
  } else {
    finalIP = ip;
  }

  try {
    let resp = await fetch(finalIP + "status", { method: "GET" });
    const parsed = JSON.parse(await resp.text());
    status.set(parsed);
    IP.set(finalIP);
    foundServer.set(true);
  } catch {
    status.set(undefined);
    IP.set(undefined);
    foundServer.set(false);
  }
}

export async function logIn(password: string, oneTime: boolean = true) {
  const $status = get(status);
  const $IP = get(IP);

  if (!$IP || !$status) {
    throw "You need to establish a connection and have the IP to be able to log in";
  }

  const passwordHashBuffer = await crypto.subtle.digest(
    "SHA-512",
    new TextEncoder().encode($status.salt + password + $status.salt),
  );

  const passwordHash = Array.from(new Uint8Array(passwordHashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

    console.log(passwordHash)

  

  const data = { passwordHash };
  console.log(passwordHash);

  if (oneTime) {
    const resp = await fetch($IP + "login/one-time", {
      method: "POST",
      body: JSON.stringify(data)
        });

    const result : sessionToken = await resp.json();
    currentSessionToken.set(result); // Example update
  }
  else {
        const resp = await fetch($IP + "login/one-time", {
      method: "POST",
      body: JSON.stringify(data)
        });

    const result : sessionToken = await resp.json();
    currentSessionToken.set(result); // Example update
  }
}
