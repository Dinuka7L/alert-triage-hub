
export function isIp(input: string) {
  // IPv4 only for demo
  return /^[0-9]{1,3}(\.[0-9]{1,3}){3}$/.test(input.trim());
}

export function isUrl(input: string) {
  try {
    const url = new URL(input.trim());
    return /^https?:/.test(url.protocol);
  } catch {
    return false;
  }
}

export function isSha256(input: string) {
  // 64 hex characters
  return /^[a-fA-F0-9]{64}$/.test(input.trim());
}

export function isSha1(input: string) {
  // 40 hex characters
  return /^[a-fA-F0-9]{40}$/.test(input.trim());
}

export function isMd5(input: string) {
  // 32 hex characters
  return /^[a-fA-F0-9]{32}$/.test(input.trim());
}

export function isHash(input: string) {
  return isMd5(input) || isSha1(input) || isSha256(input);
}

export function getInputType(input: string) {
  if (isIp(input)) return "ip";
  if (isUrl(input)) return "url";
  if (isHash(input)) return "hash";
  return "unknown";
}
