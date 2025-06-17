export async function get(
  req: Request,
  inf: Deno.ServeHandlerInfo<Deno.NetAddr>,
  url: URL,
): Promise<Response> {
  return new Response("Bad GET request", { status: 400 });
}