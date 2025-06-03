import type { sessionToken, statusData } from "./classes"

export let IP : string | undefined= undefined 
export let status : statusData | undefined = undefined

export let currentSessionToken :sessionToken | undefined = undefined

export async function initApi() {
  IP = await (await fetch("/ip.txt", {method: "GET"})).text()


  let resp = await (await fetch(IP + "status", {method: "GET"})).text()


  status = JSON.parse(resp)
}

export async function logIn(password : string, oneTime : boolean){
  let resp = await(await fetch(IP + ""))
}

export async function logEveryoneOut(){

}

export async function logOut() {
  
}