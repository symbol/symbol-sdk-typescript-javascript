/**
 * Copyright 2020 NEM Foundation (https://nem.io)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import networkConfig from '../../../config/network.conf.json'

// XXX network store getters
const {targetBlockTime} = networkConfig.networks['testnet-publicTest'].properties

export class TimeHelpers {
  public static addZero = function (number: number): string {
    return number < 10 ? `0${number}` : `${number}`
  }

  public static formatTimestamp = (timestamp: number): string => {
    const d = new Date(timestamp)
    const date = `${TimeHelpers.addZero(d.getFullYear())}-${TimeHelpers.addZero(d.getMonth() + 1)}-${TimeHelpers.addZero(d.getDate())} `
    const time = ` ${TimeHelpers.addZero(d.getHours())}:${TimeHelpers.addZero(d.getMinutes())}:${TimeHelpers.addZero(d.getSeconds())}`
    return date + time
  }

  public static formatSeconds = function (second: number): string {
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
      result = `${m} m ${result}`
    }
    if (h > 0 || d > 0) {
      result = `${h} h ${result}`
    }
    if (d > 0) {
      result = `${d} d ${result}`
    }

    return result
  }

  /**
   * Transforms a number of blocks into a relative time
   * eg. 15 blocks => 1s
   * @param duration in block number
   */
  public static durationToRelativeTime = (durationInBlocks: number): string => {
    try {
      const isDurationNegative = durationInBlocks < 0
      const absoluteDuration = isDurationNegative ? durationInBlocks * -1 : durationInBlocks
      const relativeTime = TimeHelpers.formatSeconds(absoluteDuration * targetBlockTime)
      const prefix = isDurationNegative ? '- ' : ''
      return `${prefix}${relativeTime}`
    } catch (error) {
      console.error('durationToRelativeTime -> error', error)
      return ''
    }
  }

  public static formatDate = (timestamp) => {
    const now = new Date(Number(timestamp))
    const year = now.getFullYear()
    let month = `${now.getMonth() + 1}`
    month = Number(month) < 10 ? `0${month}` : month
    let date = `${now.getDate()}`
    date = Number(date) < 10 ? `0${date}` : date
    let hour = `${now.getHours()}`
    hour = Number(hour) < 10 ? `0${hour}` : hour
    let minute = `${now.getMinutes()}`
    minute = Number(minute) < 10 ? `0${minute}` : minute
    let second = `${now.getSeconds()}`
    second = Number(second) < 10 ? `0${second}` : second
    return `${year}-${month}-${date} ${hour}:${minute}:${second}`
  }

  public static getCurrentMonthFirst = function (date: Date): Date {
    date.setDate(1)
    return date
  }

  public static getCurrentMonthLast = function (date: Date): Date {
    let currentMonth = date.getMonth()
    const nextMonth = ++ currentMonth
    const nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
    return new Date(Number(nextMonthFirstDay))
  }
}
