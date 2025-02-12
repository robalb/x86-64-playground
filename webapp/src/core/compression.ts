import {gzipSync, gunzipSync} from 'fflate'

function base64UrlsafeToBytes(base64_url: string): Uint8Array {
  const base64 = base64_url
  .replace(/-/g, '+')
  .replace(/_/g, '/')
  .replace(/\./g, '=');
  const binString = atob(base64);
  return Uint8Array.from(binString, (m) => m.codePointAt(0));
}

function bytesToBase64Urlsafe(bytes: Uint8Array):string {
  const binString = Array.from(bytes, (byte) =>
    String.fromCodePoint(byte),
  ).join("");
  let base64 = btoa(binString);
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '.');
}

export function compressStringToBase64(input: string): string {
  const encoder = new TextEncoder();
  const inputUint8Array = encoder.encode(input);
  const gzipped = gzipSync(inputUint8Array, {
    filename: '',
    // Can be a Date, date string, or Unix timestamp
    mtime: '9/1/16 2:00 PM'
  });
  return bytesToBase64Urlsafe(gzipped);
}

export function decompressBase64ToString(base64: string): string {
  const compressedUint8Array = base64UrlsafeToBytes(base64);
  const decompressedUint8Array = gunzipSync(compressedUint8Array);
  const decoder = new TextDecoder();
  return decoder.decode(decompressedUint8Array);
}

/*
 * Gzip compression using the native CompressionStream API.
 * This is a feature with baseline2023 support
 */

// export async function compressStringToBase64(input) {
//     const encoder = new TextEncoder();
//     const inputUint8Array = encoder.encode(input);

//     // Compress with CompressionStream
//     const compressedStream = new CompressionStream('gzip');
//     const writer = compressedStream.writable.getWriter();
//     writer.write(inputUint8Array);
//     writer.close();

//     const compressedUint8Array = new Uint8Array(await new Response(compressedStream.readable).arrayBuffer());
//     return bytesToBase64Urlsafe(compressedUint8Array);
// }

// export async function decompressBase64ToString(base64) {
//     const compressedUint8Array = base64UrlsafeToBytes(base64);

//     // Decompress with DecompressionStream
//     const decompressedStream = new DecompressionStream('gzip');
//     const writer = decompressedStream.writable.getWriter();
//     writer.write(compressedUint8Array);
//     writer.close();

//     const decompressedUint8Array = new Uint8Array(await new Response(decompressedStream.readable).arrayBuffer());
//     const decoder = new TextDecoder();
//     return decoder.decode(decompressedUint8Array);
// }

