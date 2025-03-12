const ALPHA_NUMERIC_REGEX = /^[a-zA-Z0-9]+$/

type AlphanumericString = string & { __brand: 'AlphanumericString' }

export function isValidId(id: string): id is AlphanumericString {
  return ALPHA_NUMERIC_REGEX.test(id)
}

export function toTitleCase(text: string): string {
  return text.replace(/\w\S*/g, (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase())
}
