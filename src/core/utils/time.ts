import {networkConfig} from '@/config/constants.ts'
const {targetBlockTime} = networkConfig

export const addZero = function (number: number): string {
    return number < 10 ? `0${number}` : `${number}`
}

export const formatTimestamp = (timestamp: number): string => {
    const d = new Date(timestamp)
    const date = `${addZero(d.getFullYear())}-${addZero(d.getMonth() + 1)}-${addZero(d.getDate())} `
    const time = ` ${addZero(d.getHours())}:${addZero(d.getMinutes())}:${addZero(d.getSeconds())}`
    return date + time
}

export const formatSeconds = function (second: number): string {
    if (!second && second !== 0) return ''
    let d = 0, h = 0, m = 0

    if (second > 86400) {
        d = Math.floor(second / 86400)
        second = second % 86400
    }
    if (second > 3600) {
        h = Math.floor(second / 3600)
        second = second % 3600
    }
    if (second > 60) {
        m = Math.floor(second / 60)
        second = second % 60
    }
    let result = ''
    if (m > 0 || h > 0 || d > 0) {
        result = m + ' m ' + result
    }
    if (h > 0 || d > 0) {
        result = h + ' h ' + result
    }
    if (d > 0) {
        result = d + ' d ' + result
    }

    return result
}

/**
 * Transforms a number of blocks into a relative time
 * eg. 15 blocks => 1s
 * @param duration in block number
 */
export const durationToRelativeTime = (durationInBlocks: number): string => {
  try {
      const isDurationNegative = durationInBlocks < 0
      const absoluteDuration = isDurationNegative ? durationInBlocks * -1 : durationInBlocks
      const relativeTime = formatSeconds(absoluteDuration * targetBlockTime)
      const prefix = isDurationNegative ? '- ' : ''
      return `${prefix}${relativeTime}`
  } catch (error) {
      console.error("durationToRelativeTime -> error", error)
      return ''
  }
}

export const formatDate = (timestamp) => {
    const now = new Date(Number(timestamp))
    let year = now.getFullYear()
    let month = now.getMonth() + 1 + ''
    month = Number(month) < 10 ? '0' + month : month
    let date = now.getDate() + ''
    date = Number(date) < 10 ? '0' + date : date
    let hour = now.getHours() + ''
    hour = Number(hour) < 10 ? '0' + hour : hour
    let minute = now.getMinutes() + ''
    minute = Number(minute) < 10 ? '0' + minute : minute
    let second = now.getSeconds() + ''
    second = Number(second) < 10 ? '0' + second : second
    return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
}

export const getCurrentMonthFirst = function (date: Date): Date {
    date.setDate(1)
    return date
}

export const getCurrentMonthLast = function (date: Date): Date {
    let currentMonth = date.getMonth()
    let nextMonth = ++currentMonth
    let nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
    return new Date(Number(nextMonthFirstDay))
}
