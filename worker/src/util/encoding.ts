/** Encoding helpers shared across crypto and the GitHub API client. */

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function utf8(input: string): Uint8Array {
  return encoder.encode(input);
}

export function fromUtf8(bytes: ArrayBuffer | Uint8Array): string {
  return decoder.decode(bytes);
}

function toBytes(input: ArrayBuffer | Uint8Array): Uint8Array {
  return input instanceof Uint8Array ? input : new Uint8Array(input);
}

/** Standard base64 (used by the GitHub contents API). */
export function base64Encode(input: ArrayBuffer | Uint8Array | string): string {
  const bytes = typeof input === 'string' ? utf8(input) : toBytes(input);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export function base64DecodeToBytes(input: string): Uint8Array {
  const binary = atob(input);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** URL-safe base64 without padding (used in tokens). */
export function base64urlEncode(input: ArrayBuffer | Uint8Array | string): string {
  return base64Encode(input).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function base64urlDecodeToBytes(input: string): Uint8Array {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4));
  return base64DecodeToBytes(padded + pad);
}

export function base64urlDecodeToString(input: string): string {
  return fromUtf8(base64urlDecodeToBytes(input));
}

/** Constant-time comparison of two strings. */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

/** A random URL-safe id. */
export function randomId(bytes = 16): string {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  return base64urlEncode(buf);
}
