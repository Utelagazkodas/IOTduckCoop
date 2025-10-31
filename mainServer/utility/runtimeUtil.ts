// deno-lint-ignore-file no-explicit-any
import { sessionTokenDB } from "../main.ts";
import { sessionTokenData, websocketCamAuth, websocketUserAuth, WSPasswordChange, WSRelay } from "../../shared/classes.ts";
import { getUnixTime } from "./util.ts";

export class Authorization {
  static async auth(req: Request): Promise<Response | sessionTokenData> {
    let authTokenHeader = req.headers.get("Authorization");

    if (!authTokenHeader) {
      return new Response(
        "An 'Authorization' is required containing a sessiontoken, it can be a bearer or just the pure token as is",
        { status: 400 },
      ); 
    }

    if (authTokenHeader.startsWith("Bearer ")) {
      authTokenHeader = authTokenHeader.slice(7);
    }

    const sessionToken: sessionTokenData =
      (await sessionTokenDB.get([authTokenHeader])).value as sessionTokenData;

    if (sessionToken) {
      if (sessionToken.expiration > getUnixTime()) {
        return sessionToken;
      }
      sessionTokenDB.delete([sessionToken.token]);
    }
    return new Response("invalid sessionToken", { status: 498 });
  }

  static async authToken(token : string) : Promise<string | sessionTokenData>{
    const sessionToken: sessionTokenData =
      (await sessionTokenDB.get([token])).value as sessionTokenData;

    if (sessionToken) {
      if (sessionToken.expiration > getUnixTime()) {
        return sessionToken;
      }
      sessionTokenDB.delete([sessionToken.token]);
    }
    return "invalid sessionToken";
  }
}

// FOR DEBUG PURPOSES CAN BE REMOVED LATER
export async function listSessionTokens(): Promise<void> {
  const everyKey: Deno.KvEntry<sessionTokenData>[] = await Array.fromAsync(
    sessionTokenDB.list({ prefix: [] }),
  );
  for (let i = 0; i < everyKey.length; i++) {
    console.log(everyKey[i]);
  }
}


export function isWebsocketCamAuth(obj: any): obj is websocketCamAuth {
 return hasKeys<websocketCamAuth>(obj, ["token", "passwordHash"]);
}

export function isWebsocketUserAuth(obj: any): obj is websocketUserAuth {
  return hasKeys<websocketUserAuth>(obj, ["sessionToken"]);
}

export function isWSRelay(obj: any): obj is WSRelay {
 return hasKeys<WSRelay>(obj, ["relay"]);
}

export function isWSPasswordChange(obj: any): obj is WSPasswordChange {
  return hasKeys<WSPasswordChange>(obj, ["passwordHash"]);
}

function hasKeys<T extends object>(obj : any, keys: (keyof T)[]): obj is T {
  return typeof obj === "object" &&
         obj !== null &&
         keys.every((key) => key in obj);
}
