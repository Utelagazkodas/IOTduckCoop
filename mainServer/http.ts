import { get } from "./http/get.ts";
import { post } from "./http/post.ts";
import { Authorization } from "./utility/runtimeUtil.ts";

export async function handleRequest(
  req: Request,
  inf: Deno.ServeHandlerInfo<Deno.NetAddr>,
): Promise<Response> {
  const url = new URL(req.url);
  let resp: Response = new Response();

  console.log(`Incoming request: ${req.method} ${req.url}`);
  Authorization.auth(req)

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

  // tries adding access control allow origin to all responses because it is needed so it works even when its a different ip and shit, it will ALWAYS fail when websocket is trying to connect
  try {
    resp.headers.set("Access-Control-Allow-Origin", "*"); // Allows requests from any origin
  } catch (_e) { /**/ }
  
  return resp;
}
