import { camDB, RUNTIMEDATA } from "../main.ts";
import { statusData } from "../utility/classes.ts";
import { handleWebsocket } from "../ws/websocket.ts";

const statusUrlPattern = new URLPattern({pathname: "/status"})

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

  if(statusUrlPattern.test(url)){
  
    // gets email hashes
    const emailHashes :  {emailHash : string, salt : string}[]= camDB.prepare("SELECT emailHash, salt FROM cameras").all()

    const tempStatusData : statusData = {emailHashes, settingsData: RUNTIMEDATA.settingsData}

    return new Response(JSON.stringify(tempStatusData), {status: 200})
  }

  

  return new Response("Bad GET request", { status: 400 });
}
