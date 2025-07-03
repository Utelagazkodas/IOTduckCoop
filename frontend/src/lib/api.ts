import { get, writable } from "svelte/store";
import type { loginData, sessionTokenData, statusData } from "./classes";
import { hash } from "./hash";
import { addSalt } from "./util";

// Svelte reactive stores
export const IP = writable<string | undefined>(undefined);
export const status = writable<statusData | undefined>(undefined);
export const serverNotFound = writable<boolean>(false);
export const currentSessionToken = writable<sessionTokenData | undefined>(
  undefined,
);

export async function initApi() {
  serverNotFound.set(false);
  IP.set(undefined);
  currentSessionToken.set(undefined);
  status.set(undefined);
  IP.set(await (await fetch("/ip.txt", { method: "GET" })).text());
  try {
    let resp = await fetch(get(IP) + "status", { method: "GET" });
    const parsed = JSON.parse(await resp.text());
    status.set(parsed);
  } catch {
    serverNotFound.set(true);
    status.set(undefined);
  }
}

export async function getGeneralStatus() {
  try {
    let resp = await fetch(get(IP) + "status", { method: "GET" });
    const parsed = JSON.parse(await resp.text());
    status.set(parsed);
  } catch {
    serverNotFound.set(true);
    status.set(undefined);
  }
}

export async function logIn(
  password: string,
  email: string,
  oneTime: boolean,
): Promise<string> {
  if (password == "") {
    return "A Password is needed";
  }

  await getGeneralStatus();

  const $status = get(status);
  const $IP = get(IP);

  if (!$IP || !$status) {
    throw "You need to establish a connection and have the IP to be able to log in";
  }

  let send: loginData;
  // ADMIN LOGIN

  if (email == "") {
    send = {
      admin: true,
      oneTime: true,
      passwordHash: hash(
        addSalt(password, $status.adminSalt),
        $status.settingsData.hashLength,
      ),
    };
  } // USER LOGIN (aka an email exists)
  else {
    // finds the salt to use for the current email
    let curEmailHash = hash(email, $status.settingsData.hashLength);
    let curEmailHashData: {
      emailHash: string;
      salt: string;
      connected: boolean;
    } | undefined = undefined;
    for (let i = 0; i < $status.emailHashes.length; i++) {
      if ($status.emailHashes[i].emailHash == curEmailHash) {
        curEmailHashData = $status.emailHashes[i];
        break;
      }
    }
    if (curEmailHashData == undefined) {
      return "Email doesnt exist";
    }
    if (curEmailHashData.connected == false) {
      return "Camera not connected, cant log in";
    }

    send = {
      admin: false,
      oneTime,
      passwordHash: hash(
        addSalt(password, curEmailHashData.salt),
        $status.settingsData.hashLength,
      ),
    };
  }

  let resp: Response;
  try {
    resp = await fetch($IP + "login", {
      method: "POST",
      body: JSON.stringify(send),
    });
  } catch (error) {
    return "Something went wrong, you should refresh";
  }

  const body = await resp.text();
  try {
    currentSessionToken.set(JSON.parse(body));
  } catch (error) {
    switch (body) {
      case "wrong password":
        if(send.admin){
          return "Wrong admin password"
        }
        else{
          return "Wrong password"
        }
        


      default:
        return "error";
        
    }
  }

  return "";
}
