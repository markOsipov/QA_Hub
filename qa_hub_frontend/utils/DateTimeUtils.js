export function getDate(timestamp) {
    return new Date(timestamp).toLocaleString('ru').split(", ")[0]
}

export function getTimeSeconds(timestamp) {
    return new Date(timestamp).toLocaleString('ru').split(", ")[1]
}

export function getTimeMinutes(timestamp) {
    return new Date(timestamp).toLocaleString('ru').split(", ")[1].substringBeforeLast(":")
}