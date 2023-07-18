export function getDate(timestamp) {
    return new Date(timestamp).toLocaleString('ru').split(", ")[0]
}

export function getTimeSeconds(timestamp) {
    return new Date(timestamp).toLocaleString('ru').split(", ")[1]
}

export function getTimeMinutes(timestamp) {
    let time = new Date(timestamp)
      .toLocaleString('ru')
      .split(", ")[1]

    return  time.substring(0, time.lastIndexOf(":"))
}