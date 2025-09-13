import { camDB, sessionTokenDB } from "../main.ts";
import {
  deleteCamData,
  logoutData,
  sessionTokenData,
} from "../utility/classes.ts";
import { Authorization } from "../utility/runtimeUtil.ts";
import { getUnixTime } from "../utility/util.ts";

const deleteCamUrlPattern = new URLPattern({
  pathname: "/deleteCam",
});

const logOutUrlPattern = new URLPattern({
  pathname: "/logout",
});

// delete was reserved
export async function del(
  req: Request,
  inf: Deno.ServeHandlerInfo<Deno.NetAddr>,
  url: URL,
): Promise<Response> {
  // deletes a cam
  if (deleteCamUrlPattern.test(url)) {
    const auth = await Authorization.auth(req);

    if (auth instanceof Response) {
      return auth;
    }

    if (!auth.admin) {
      return new Response("unathorized", { status: 401 });
    }

    let data: deleteCamData;
    try {
      data = JSON.parse(await req.text());
    } catch (_error) {
      return new Response("Bad json in body or no data", { status: 422 });
    }

    if (
      camDB.exec(
        "DELETE FROM cameras WHERE publicId=? AND email=?",
        data.publicId,
        data.email,
      ) != 1
    ) {
      return new Response("Something went wrong, id probably doesnt exist", {
        status: 500,
      });
    }

    return new Response("Deleted camera", { status: 200 });
  }

  // log out
  if (logOutUrlPattern.test(url)) {
    const auth = await Authorization.auth(req);

    if (auth instanceof Response) {
      return auth;
    }

    let data: logoutData;
    try {
      data = JSON.parse(await req.text());
    } catch (_error) {
      return new Response("Bad json in body or no data", { status: 422 });
    }

    if (data.everywhere) {
      const everyKey : Deno.KvEntry<sessionTokenData>[] =
        await Array.fromAsync(
          sessionTokenDB.list({ prefix: [] }),
        )

        const curTime : number = getUnixTime()
        for (let i = 0; i < everyKey.length; i++) {
            if((everyKey[i].value.admin && auth.admin) || (!auth.admin && auth.email == everyKey[i].value.email) || (everyKey[i].value.expiration < curTime)){
                sessionTokenDB.delete(everyKey[i].key)
            }
        }
    } else {
      sessionTokenDB.delete([auth.token]);
      return new Response(null, {status: 200});
    }
  }

  return new Response("Bad DELETE request", { status: 400 });
}
