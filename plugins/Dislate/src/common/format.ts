const string = (text: string, regex?: boolean): string => text
    .split(regex ? /(?=[A-Z])/ : "_")
    .map((e: string) => e[0].toUpperCase() + e.slice(1))
    .join(" ")

export default { string }