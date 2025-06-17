export async function handleRequest(req: Request, inf: Deno.ServeHandlerInfo<Deno.NetAddr>): Promise<Response> {
    let resp: Response = new Response
    console.log(`Incoming request: ${req.method} ${req.url}`)

    switch (req.method) {
        case "GET":
            resp = await get(req, inf)
            break
        case "POST":
            resp = await post(req, inf)
            break
        default:
            return new Response("Method is not supported", {status: 405})
            
    }

    resp.headers.set('Access-Control-Allow-Origin', '*'); // Allows requests from any origin
    return resp
}


async function get(req: Request, inf: Deno.ServeHandlerInfo<Deno.NetAddr>) : Promise<Response>{

}

async function post(req: Request, inf: Deno.ServeHandlerInfo<Deno.NetAddr>) : Promise<Response>{

}