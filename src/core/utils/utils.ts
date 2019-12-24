import {NetworkType} from "nem2-sdk"
import {defaultNetworkConfig} from "@/config"

export const copyTxt = (txt) => {
    return new Promise((resolve) => {
        const input = document.createElement('input')
        input.setAttribute('readonly', 'readonly')
        input.setAttribute('value', txt)
        document.body.appendChild(input)
        input.select()
        document.execCommand('copy')
        document.body.removeChild(input)
        resolve()
    })
}

export const localSave = (key, value) => {
    localStorage.setItem(key, value)
}

export const localRead = (key) => {
    return localStorage.getItem(key) || ''
}

export const localRemove = (key) => {
    localStorage.removeItem(key)
}

export const sessionSave = (key, value) => {
    sessionStorage.setItem(key, value)
}

export const sessionRead = (key) => {
    return sessionStorage.getItem(key) || ''
}

export const getObjectLength = (targetObject) => {
    return Object.keys(targetObject).length
}


export const isRefreshData = function (localStorageName, refreshTime, borderlineTime) {
    if (localRead(localStorageName) === '') {
        return true
    }
    const currentTime = new Date()
    const currentTimestamp = currentTime.getTime()
    const marketPriceDataList = JSON.parse(localRead(localStorageName))
    const timeDifference = Number(currentTimestamp) - Number(marketPriceDataList.timestamp)
    if (refreshTime < timeDifference || borderlineTime == 0) {
        return true
    }
    return false
}

export const cloneData = object => JSON.parse(JSON.stringify(object))

export const getTopValueInObject = (object: any): any => {
    return Object.values(object)[0]
}

/**
 * Flattens an array that can have elements nested up to 2 levels
 * @param array
 */
export const flattenArrayOfStrings = (array: any[]): any[] => {
    const step1 = [].concat(...array).map(item => item)
    return [].concat(...step1).map(item => item)
}

export const httpToWs = (URL: string): string => {
    const url = URL.toLowerCase()
    const isHttps = url.substring(0, 5) === 'https'

    return isHttps
        ? url.replace('https', 'wss')
        : url.replace('http', 'ws')
}

export function getDefaultAccountNetworkType(): NetworkType {
    const accountMap = localRead('accountMap')
    if (accountMap === '') return defaultNetworkConfig.DEFAULT_NETWORK_TYPE
    // use the last created account network type
    const accounts: any[] = Object.values(JSON.parse(accountMap)).reverse()
    if (!accounts[0]) return defaultNetworkConfig.DEFAULT_NETWORK_TYPE
    return accounts[0].networkType
}

export function completeUrlWithHostAndProtocol(inputNodeValue: string): string {
    const numberOfColon = inputNodeValue.match(/:/img) ? inputNodeValue.match(/:/img).length : 0
    const pointIndex = inputNodeValue.indexOf('.')
    const colonIndex = inputNodeValue.indexOf(':')
    if (numberOfColon >= 2) return inputNodeValue
    if (numberOfColon == 0) {
        return `http://${inputNodeValue}:3000`
    }
    if (pointIndex > colonIndex) {
        return `${inputNodeValue}:3000`
    }
    if (pointIndex < colonIndex) {
        return `http://${inputNodeValue}`
    }
}
