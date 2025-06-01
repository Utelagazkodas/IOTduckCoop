export let initialised : boolean = false
export let IP : string | undefined= undefined 

export async function initApi() {
  IP = await (await fetch("/ip.txt")).text()

  console.log(IP)
  let res = await (await fetch(IP + "status")).text()
  console.log(res)
}