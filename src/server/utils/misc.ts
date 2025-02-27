export function toSlug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

export function getFirstKey<T extends Record<string, any>>(obj: T): keyof T {
  const keys = Object.keys(obj) as Array<keyof T>
  if (keys.length === 0) {
    throw new ApplicationError('Object must have at least one key', HttpStatusCode.INTERNAL_SERVER_ERROR)
  }
  return keys[0]
}
