export function getUnixTime(): number {
    return Math.round(Date.now() / 1000)
}

export function addSalt(toBeHashed : string, salt : string): string{
    return `${salt}${toBeHashed}${salt}`
}

// dont ask me what this is or how it works, deepseek wrote this part, i think i am retiring as a programmer
export function isValidEmail(email: string): boolean {
  // deno-lint-ignore no-control-regex
  const pattern : RegExp = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
  return pattern.test(email);
}   

export function useIp(ip : string, protocol : string, directory : string) : string {
    return `${protocol}://${ip}${directory}`
}