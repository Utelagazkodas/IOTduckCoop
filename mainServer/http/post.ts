export async function post(
  req: Request,
  inf: Deno.ServeHandlerInfo<Deno.NetAddr>,
  url: URL,
): Promise<Response> {
    return new Response("Bad POST request", { status: 400 });
}