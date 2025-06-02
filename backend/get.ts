import { getStatusData } from "./util.ts";

// URL PATTERNS
const statusPattern = new URLPattern({ pathname: "/status" });

export async function get(
  req: Request,
  inf: Deno.ServeHandlerInfo<Deno.NetAddr>,
): Promise<Response> {

  
  const url = new URL(req.url);

  // status
  if (statusPattern.test(url)) {

    return new Response(JSON.stringify(getStatusData()), { status: 200 });
  }

  return new Response("404, bad get request", { status: 404 });
}
