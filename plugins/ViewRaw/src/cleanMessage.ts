function sortObject<T extends object>(obj: T): T {
    return Object.fromEntries(Object.entries(obj).sort(([k1], [k2]) => k1.localeCompare(k2))) as T
}

export function cleanMessage(msg) {
    const clone = sortObject(JSON.parse(JSON.stringify(msg)))
    for (const key in clone.author) {
        switch (key) {
            case "id":
            case "username":
            case "usernameNormalized":
            case "discriminator":
            case "avatar":
            case "bot":
            case "system":
            case "publicFlags":
                break;
            default:
                // phone number, email, etc
                delete clone.author[key]
        }
    }

    return clone
}
