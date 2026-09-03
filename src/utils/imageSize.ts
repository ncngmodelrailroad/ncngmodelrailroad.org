import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface ImageSize {
  width: number;
  height: number;
  type: 'jpeg' | 'png';
}

const PUBLIC_DIR = join(process.cwd(), 'public');

const cache = new Map<string, ImageSize | null>();

function readPng(buffer: Buffer): ImageSize | null {
  // PNG signature, then an IHDR chunk whose width and height are big-endian
  // uint32s at byte offsets 16 and 20.
  if (buffer.length < 24) return null;
  if (buffer.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20), type: 'png' };
}

function readJpeg(buffer: Buffer): ImageSize | null {
  if (buffer.length < 4 || buffer.readUInt16BE(0) !== 0xffd8) return null;

  let offset = 2;
  while (offset < buffer.length - 9) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];

    // Standalone markers carry no length field.
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2;
      continue;
    }

    const length = buffer.readUInt16BE(offset + 2);

    // Any Start Of Frame marker holds the dimensions, except the four that are
    // reserved for other purposes (0xC4, 0xC8, 0xCC are not frame headers).
    const isStartOfFrame =
      marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;

    if (isStartOfFrame) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
        type: 'jpeg',
      };
    }

    offset += 2 + length;
  }

  return null;
}

/**
 * Read the pixel dimensions of an image in `public/` at build time.
 *
 * Open Graph consumers size a preview card from the declared width and height
 * before the image loads, so hardcoded values produce letterboxed or badly
 * cropped cards whenever they disagree with the file. Reading the real header
 * keeps the two in step without adding a dependency or an image pipeline.
 *
 * Returns null for a missing or unrecognized file so the caller can omit the
 * dimension tags rather than publish a guess.
 */
export function getPublicImageSize(publicPath: string): ImageSize | null {
  const normalized = publicPath.split('?')[0].replace(/^\/+/, '');
  if (cache.has(normalized)) return cache.get(normalized) ?? null;

  let result: ImageSize | null = null;
  try {
    const buffer = readFileSync(join(PUBLIC_DIR, normalized));
    result = readPng(buffer) ?? readJpeg(buffer);
  } catch {
    result = null;
  }

  cache.set(normalized, result);
  return result;
}
