import "jsr:@std/dotenv/load";
import { generate } from "@alikia/random-key";

const PASSWORD = Deno.env.get("PASSWORD");
const SESSIONTOKENLENGTH = Number(Deno.env.get("SESSIONTOKENLENGTH"))
const SESSIONTOKENVALID = Number(Deno.env.get("SESSIONTOKENVALID"))

const SessionTokens: { [key: string]: number } = {};

Deno.serve({ port: 5000 }, (req) => {
  if (req.headers.get("upgrade") != "websocket") {
    return new Response(null, { status: 501 });
  }
  const { socket, response } = Deno.upgradeWebSocket(req);

  let loggedIn = false;

  socket.addEventListener("message", (event) => {
    try {
      if(!loggedIn){
        let loginData : {password : string, sessionToken : boolean | string} = JSON.parse(event.data)

        if(loginData.password && loginData.sessionToken && typeof(loginData.sessionToken) == "boolean"){
          if(loginData.password == PASSWORD){
            loggedIn = true

            if(loginData.sessionToken == true){

            }
          }
          else{
            
          }
        }else if(typeof(loginData.sessionToken) == "string"){
          console.log("sessiontoken")
        }else {
          console.log("login data formated badly")
        }
      }
      else{
        socket.send("you are logged in")
      }
    } catch (error) {
      console.log("Bad message, probably not JSON")
    }
  });
  return response;
});
