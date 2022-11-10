export function getDate(timestamp) {
    return new Date(timestamp).toLocaleString('ru').split(", ")[0]
}

export function getTime(timestamp) {
    return new Date(timestamp).toLocaleString('ru').split(", ")[1]
}