import { handleWebsocket } from "../ws/websocket.ts";

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

    handleWebsocket(socket)

    return response;
  }



  return new Response("Bad GET request", { status: 400 });
}