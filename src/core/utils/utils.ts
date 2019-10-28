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

export const getTopValueInObject = (object: any) => {
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
