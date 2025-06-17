import { get } from "./http/get.ts";
import { post } from "./http/post.ts";
import { handleWebsocket } from "./ws/websocket.ts";

export async function handleRequest(
  req: Request,
  inf: Deno.ServeHandlerInfo<Deno.NetAddr>,
): Promise<Response> {
  const url = new URL(req.url);
  let resp: Response = new Response();

  console.log(`Incoming request: ${req.method} ${req.url}`);

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

    handleWebsocket(socket)

    return response;
  }

  // switches between the supported methods
  switch (req.method) {
    case "GET":
      resp = await get(req, inf, url);
      break;
    case "POST":
      resp = await post(req, inf, url);
      break;
    default:
      return new Response("Method is not supported", { status: 405 });
  }

  // adds access control allow origin to all responses because it is needed so it works even when its a different ip and shit
  resp.headers.set("Access-Control-Allow-Origin", "*"); // Allows requests from any origin
  return resp;
}
