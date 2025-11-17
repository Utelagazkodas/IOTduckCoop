import { get } from "svelte/store";
import { getGeneralStatus } from "./network";
import { currentSessionToken, IP, status } from "./stores";
import type { loginData, logoutData, sessionTokenData } from "@classes";
import { hash } from "@hash";
import { addSalt, getUnixTime, isValidEmail } from "$lib/util/util";
import { removeCookie, setCookie } from "typescript-cookie";
import { getAdminData } from "./admin";
import { connectWebsocket, disconnectWS } from "./user";

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

    if(!isValidEmail(email)){
      return "A valid email is needed"
    }
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
      email: email,
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
    resp = await fetch($IP.httpIp + "login", {
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
        if (send.admin) {
          return "An email is needed"
          //return "Wrong admin password";
        } else {
          return "Wrong password";
        }

      default:
        return body;
    }
  }

  if (send.admin) {
    getAdminData();
  }
  else{
    //connectWebsocket();
  }

  setCookie("sessionToken", JSON.stringify(get(currentSessionToken)), {
    expires: (get(currentSessionToken)!.expiration - getUnixTime()) /
      (60 * 60 * 24),
  });
  return "";
}

export async function checkSessionToken(
  toCheck?: sessionTokenData,
): Promise<void> {
  const curIP = get(IP);
  const curSessionToken = toCheck ? toCheck : get(currentSessionToken);
  const curStatus = get(status);

  if (!curIP || !curSessionToken || !curStatus) {
    throw "an ip, a sessiontoken and a status (being connected to the server) is required to check the validity of your current token";
  }

  if (curSessionToken.expiration < getUnixTime()) {
    removeCookie("sessionToken");

    currentSessionToken.set(undefined);
    return;
  }

  let resp: Response;
  try {
    resp = await fetch(curIP.httpIp + "sessionTokenCheck", {
      method: "GET",
      headers: { "Authorization": curSessionToken.token },
    });
  } catch (error) {
    removeCookie("sessionToken");

    currentSessionToken.set(undefined);
    getGeneralStatus();
    return;
  }

  if (resp.status != 200) {
    removeCookie("sessionToken");

    currentSessionToken.set(undefined);
    return;
  }

  const body = await resp.text();
  try {
    currentSessionToken.set(JSON.parse(body));
  } catch (error) {
    removeCookie("sessionToken");
    currentSessionToken.set(undefined);
    return;
  }

  setCookie("sessionToken", JSON.stringify(get(currentSessionToken)), {
    expires: (get(currentSessionToken)!.expiration - getUnixTime()) /
      (60 * 60 * 24),
  });
  return;
}

export async function logOut(everywhere: boolean): Promise<void> {
  const curIP = get(IP);
  const curSessionToken = get(currentSessionToken);
  const curStatus = get(status);

  if (!curIP || !curSessionToken || !curStatus) {
    throw "an ip, a sessiontoken and a status (being connected to the server) is required to log out";
  }

  fetch(curIP.httpIp + "logout", {method: "DELETE", headers: { "Authorization": curSessionToken.token }, body: JSON.stringify({everywhere} as logoutData)})

  disconnectWS()
  

  currentSessionToken.set(undefined)
  removeCookie("sessionToken");
  return
}
