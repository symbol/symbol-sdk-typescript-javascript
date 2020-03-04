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
import {NetworkType} from 'symbol-sdk'

// internal dependencies
import networkConfig from '../../../config/network.conf.json'

export class StorageHelpers {
  public static copyTxt = (txt) => {
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

  public static localSave = (key, value) => {
    localStorage.setItem(key, value)
  }

  public static localRead = (key) => {
    return localStorage.getItem(key) || ''
  }

  public static localRemove = (key) => {
    localStorage.removeItem(key)
  }

  public static sessionSave = (key, value) => {
    sessionStorage.setItem(key, value)
  }

  public static sessionRead = (key) => {
    return sessionStorage.getItem(key) || ''
  }

  public static getObjectLength = (targetObject) => {
    return Object.keys(targetObject).length
  }


  public static isRefreshData = function (localStorageName, refreshTime, borderlineTime) {
    if (StorageHelpers.localRead(localStorageName) === '') {
      return true
    }
    const currentTime = new Date()
    const currentTimestamp = currentTime.getTime()
    const marketPriceDataList = JSON.parse(StorageHelpers.localRead(localStorageName))
    const timeDifference = Number(currentTimestamp) - Number(marketPriceDataList.timestamp)
    if (refreshTime < timeDifference || borderlineTime === 0) {
      return true
    }
    return false
  }

  public static cloneData = object => JSON.parse(JSON.stringify(object))

  public static getTopValueInObject = (object: any): any => {
    return Object.values(object)[0]
  }

  /**
   * Flattens an array that can have elements nested up to 2 levels
   * @param array
   */
  public static flattenArrayOfStrings = (array: any[]): any[] => {
    const step1 = [].concat(...array).map(item => item)
    return [].concat(...step1).map(item => item)
  }


  public static getDefaultAccountNetworkType(): NetworkType {
    const accountMap = StorageHelpers.localRead('accountMap')
    if (accountMap === '') return networkConfig.defaultNetworkType
    // use the last created account network type
    const accounts: any[] = Object.values(JSON.parse(accountMap)).reverse()
    if (!accounts[0]) return networkConfig.defaultNetworkType
    return accounts[0].networkType
  }
}
