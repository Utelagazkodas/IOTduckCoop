import "jsr:@std/dotenv/load";
import { generate } from "@alikia/random-key";

const PASSWORD = Deno.env.get("PASSWORD");
const SESSIONTOKENLENGTH = Number(Deno.env.get("SESSIONTOKENLENGTH"))
const SESSIONTOKENVALIDLENGTH = Number(Deno.env.get("SESSIONTOKENVALIDLENGTH"))

if(!PASSWORD || !SESSIONTOKENLENGTH || !SESSIONTOKENVALIDLENGTH){
  throw "You need to initialize the project, you can do it by running `deno task gen`"
}

const SessionTokens: { [key: string]: number } = {};

Deno.serve({ port: 5000 }, (req) => {


  return new Response("asd")
  
});
