export function getDate(dateStr) {
    return new Date(dateStr).toLocaleString('ru').split(", ")[0]
}

export function getTimeSeconds(dateStr) {
    return new Date(dateStr).toLocaleString('ru').split(", ")[1]
}

export function getDateTime(dateStr) {
    const dateComponents = new Date(dateStr).toLocaleString('ru').split(", ")
    const date = dateComponents[0]
    const time = dateComponents[1]
    const timeMinutes = time.substring(0, time.lastIndexOf(":"))

    return `${timeMinutes} ${date}`
}

export function getTimeMinutes(timestamp) {
    let time = new Date(timestamp)
      .toLocaleString('ru')
      .split(", ")[1]

    return time.substring(0, time.lastIndexOf(":"))
}

export function daysBetween(date1, date2) {
    const parsedDate1 = new Date(date1)
    const parsedDate2 = date2 && new Date(date2) || new Date()

    const coeff = (1000 * 3600 * 24)
    const timediff = (parsedDate2.getTime() - parsedDate1.getTime()) / coeff
    return Number.parseInt(timediff)
}

export function secondsBetween(date1, date2) {
    const parsedDate1 = new Date(date1)
    const parsedDate2 = date2 && new Date(date2) || new Date()

    const coeff = (1000)
    const timediff = (parsedDate2.getTime() - parsedDate1.getTime()) / coeff
    return Number.parseInt(timediff)
}