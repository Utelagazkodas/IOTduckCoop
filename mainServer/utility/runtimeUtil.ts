import { sessionTokenDB } from "../main.ts";
import { sessionTokenData } from "./classes.ts";
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
