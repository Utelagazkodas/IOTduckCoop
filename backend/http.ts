import { post } from "./post.ts";
import { get } from "./get.ts";

export async function request(
  req: Request,
  inf: Deno.ServeHandlerInfo<Deno.NetAddr>,
): Promise<Response> {
  let resp: Response;
  console.log(`Incoming request: ${req.method} ${req.url}`);

  switch (req.method) {
    case "GET":
      resp = await get(req, inf);
      break;
    case "POST":
      resp = await post(req, inf);
      break;
    default:
      resp = new Response("Method is not supported", { status: 405 });
  }

  resp.headers.set("Access-Control-Allow-Origin", "*"); // Allows requests from any origin
  return resp;
}


