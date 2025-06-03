import type { sessionToken, statusData } from "./classes";

export let IP: string | undefined = undefined;
export let status: statusData | undefined = undefined;

export let currentSessionToken: sessionToken | undefined = undefined;
export let foundServer: boolean | undefined = undefined;

export async function initApi(ip?: string) {
  if (!ip) {
    IP = await (await fetch("/ip.txt", { method: "GET" })).text();
  } else {
    IP = ip;
  }

  let resp = await (await fetch(IP + "status", { method: "GET" })).text();

  if (status) {
    status = JSON.parse(resp);
    foundServer = true;
  } else {
    status = undefined
    IP = undefined
    foundServer = false;
  }
}

export async function logIn(password: string, oneTime: boolean = true) {
  if (!IP || !status) {
    throw "you need to establish a connection and have the ip to be able to log in";
  }

  let passwordHashBuffer = await crypto.subtle.digest(
    "SHA-512",
    new TextEncoder().encode(status?.salt + password + status?.salt),
  );
  let passwordHash = new TextDecoder().decode(passwordHashBuffer);
  let data: { passwordHash: string } = { passwordHash };
  console.log(passwordHash);
  if (oneTime) {
    let resp = fetch(IP + "login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

export async function logEveryoneOut() {
}

export async function logOut() {
}
