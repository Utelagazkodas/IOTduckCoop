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
    console.log(authTokenHeader);

    const sessionToken: sessionTokenData =
      (await sessionTokenDB.get([authTokenHeader])).value as sessionTokenData;

    if (sessionToken) {
      if (sessionToken.expiration > getUnixTime()) {
        
        return sessionToken

      }
      sessionTokenDB.delete([sessionToken.token]);
    }
    return new Response("invalid sessionToken", { status: 498 });
  }
}
