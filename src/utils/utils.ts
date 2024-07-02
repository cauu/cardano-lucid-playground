const hexTable = new TextEncoder().encode('0123456789abcdef');

export function encodedLen(n: number): number {
  return n * 2;
}

export function encode(src: Uint8Array): Uint8Array {
  const dst = new Uint8Array(encodedLen(src.length));
  for (let i = 0; i < dst.length; i++) {
    const v = src[i];
    dst[i * 2] = hexTable[v >> 4];
    dst[i * 2 + 1] = hexTable[v & 0x0f];
  }
  return dst;
}

export function encodeToString(src: Uint8Array): string {
  return new TextDecoder().decode(encode(src));
}

export function decodedLen(x: number): number {
  return x >>> 1;
}

function fromHexChar(byte: number): number {
  // '0' <= byte && byte <= '9'
  if (48 <= byte && byte <= 57) return byte - 48;
  // 'a' <= byte && byte <= 'f'
  if (97 <= byte && byte <= 102) return byte - 97 + 10;
  // 'A' <= byte && byte <= 'F'
  if (65 <= byte && byte <= 70) return byte - 65 + 10;

  throw new Error(`Invalid bytes: ${byte}`);
}

export function decode(src: Uint8Array): Uint8Array {
  const dst = new Uint8Array(decodedLen(src.length));
  for (let i = 0; i < dst.length; i++) {
    const a = fromHexChar(src[i * 2]);
    const b = fromHexChar(src[i * 2 + 1]);
    dst[i] = (a << 4) | b;
  }

  if (src.length % 2 == 1) {
    // Check for invalid char before reporting bad length,
    // since the invalid char (if present) is an earlier problem.
    fromHexChar(src[dst.length * 2]);
    throw new Error('Invalid hex string length');
  }

  return dst;
}
// export function fromHex(hex: string): Uint8Array {
//   return decodeString(hex);
// }

export function toHex(bytes: Uint8Array): string {
  return encodeToString(bytes);
}

export function hexToUtf8(hex: string): string {
  return new TextDecoder().decode(decode(new TextEncoder().encode(hex)));
}

export function utf8ToHex(utf8: string): string {
  return toHex(new TextEncoder().encode(utf8));
}
