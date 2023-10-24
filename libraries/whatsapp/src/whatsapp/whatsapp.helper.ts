/**
 * Encodes the given object into a format suitable for transmission or storage.
 *
 * @param {any} obj - The object to encode.
 * @return {any} The encoded object.
 */
export function encodeBuffer(obj: any): any {
  if (typeof obj !== 'object' || !obj) {
    return obj
  }

  if (Buffer.isBuffer(obj) || obj instanceof Uint8Array) {
    return {
      type: 'Buffer',
      data: Buffer.from(obj).toString('base64'),
    }
  }

  if (Array.isArray(obj)) {
    return obj.map(encodeBuffer)
  }

  const newObj: any = {}
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      newObj[key] = encodeBuffer(obj[key])
    }
  }
  return newObj
}

/**
 * Decodes a buffer object or an array of buffer objects.
 *
 * @param {any} obj - The object to be decoded.
 * @return {any} The decoded object.
 */
export function decodeBuffer(obj: any): any {
  if (
    typeof obj !== 'object' ||
    !obj ||
    Buffer.isBuffer(obj) ||
    obj instanceof Uint8Array
  ) {
    return obj
  }

  if (obj.type === 'Buffer') {
    return Buffer.from(obj.data, 'base64')
  }

  if (Array.isArray(obj)) {
    return obj.map(decodeBuffer)
  }

  const newObj: any = {}
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      newObj[key] = decodeBuffer(obj[key])
    }
  }
  return newObj
}
