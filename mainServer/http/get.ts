import { camDB, RUNTIMEDATA } from "../main.ts";
import {
  cameraAdminData,
  databaseType,
  statusData,
} from "../../shared/classes.ts";
import { Authorization } from "../utility/runtimeUtil.ts";
import { handleWebsocket } from "../ws/websocket.ts";

const statusUrlPattern = new URLPattern({ pathname: "/status" });
const camerasAdminDataUrlPattern = new URLPattern({ pathname: "/adminData" });
const sessionTokenValidityUrlPattern = new URLPattern({
  pathname: "/sessionTokenCheck",
});
const cameraDataUrlPattern = new URLPattern({ pathname: "/cameraData" });

export async function get(
  req: Request,
  inf: Deno.ServeHandlerInfo<Deno.NetAddr>,
  url: URL,
): Promise<Response> {
  //checks if it is trying to connect to ws
  if (url.pathname == "/connect" || req.headers.get("upgrade") == "websocket") {
    if (url.pathname != "/connect") {
      return new Response("you can only connect as a websocket on /connect", {
        status: 403,
      });
    }
    if (req.headers.get("upgrade") != "websocket") {
      return new Response(
        "on /connect you can only upgrade to a websocket connection, and you need to have upgrade: websocket header",
        { status: 426 },
      );
    }

    
    const { socket, response } = Deno.upgradeWebSocket(req);

    handleWebsocket(socket);

    return response;
  }

  // THE DATA PUBLICLY AVAILABLE
  if (statusUrlPattern.test(url)) {
    // gets email hashes
    const emailHashes: {
      emailHash: string;
      salt: string;
      connected: boolean;
      publicId : string
    }[] = camDB.prepare(
      "SELECT emailHash, salt, publicId connected FROM cameras",
    ).all();

    const tempStatusData: statusData = {
      adminSalt: RUNTIMEDATA.adminSalt,
      emailHashes,
      settingsData: RUNTIMEDATA.settingsData,
    };

    return new Response(JSON.stringify(tempStatusData), { status: 200 });
  }

  // THE DATA AVAILABLE TO ADMINS
  if (camerasAdminDataUrlPattern.test(url)) {
    const auth = await Authorization.auth(req);

    if (auth instanceof Response) {
      return auth;
    }

    if (!auth.admin) {
      return new Response("unathorized", { status: 401 });
    }
    const data: cameraAdminData[] = camDB.prepare(
      "SELECT token, publicId, salt, connected, email, emailHash, address FROM cameras",
    ).all();

    return new Response(JSON.stringify(data), { status: 200 });
  }

  // YOU CAN VALIDATE YOUR TOKEN ON /sessionTokenCheck
  if (sessionTokenValidityUrlPattern.test(url)) {
    const auth = await Authorization.auth(req);

    if (auth instanceof Response) {
      return auth;
    }

    return new Response(JSON.stringify(auth), { status: 200 });
  }

  // GET THE CAMERA DATA ON /cameraData !!! TOKEN NEEDS TO BE IN token HEADER
  if (cameraDataUrlPattern.test(url)) {
    const tokenHeader = req.headers.get("token");

    const camData: databaseType[] = camDB.prepare(
      "SELECT * FROM cameras WHERE token=?",
    ).all(tokenHeader) as databaseType[];

    if (!camData || camData.length == 0) {
      return new Response("unathorized", {status: 401})
    }

    return new Response(JSON.stringify(camData[0]), {status: 200})
  }

  return new Response("Bad GET request", { status: 400 });
}
