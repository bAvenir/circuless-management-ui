export function replaceUrlPrefix(url?: string, newPrefix?: string): string {
    if (!url) return "";
    const urlPattern = /^(https?:\/\/)?([^/]+)(.*)$/i;
    const match = url.match(urlPattern);

    if (match) {
        return `${newPrefix}${match[3]}`;
    }

    return `${newPrefix}${url}`;
}
