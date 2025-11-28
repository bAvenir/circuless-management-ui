const ALPHA_NUMERIC_REGEX = /^[a-zA-Z0-9]+$/;

type AlphanumericString = string & { __brand: "AlphanumericString" };

export function isValidId(id: string): id is AlphanumericString {
    return ALPHA_NUMERIC_REGEX.test(id);
} // Checking if the route ends in id - FILTERING e.g.

export function toTitleCase(text: string): string {
    return text.replace(
        /\w\S*/g,
        (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
}

export function toSlug(text: string) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function getFirstKey<T extends Record<string, any>>(obj: T): keyof T {
    const keys = Object.keys(obj) as Array<keyof T>;
    if (keys.length === 0) {
        throw new ApplicationError(
            "Object must have at least one key",
            HttpStatusCode.INTERNAL_SERVER_ERROR
        );
    }
    return keys[0];
}
