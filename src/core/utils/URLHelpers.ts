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
// internal dependencies
import {UrlValidator} from '../validation/validators'

export class URLHelpers {
  public static formatUrl = (rawUrl: string) => {
    if (!UrlValidator.validate(rawUrl)) {
      throw new Error(`Invalid URL: ${rawUrl}`)
    }

    const url = new URL(rawUrl)
    return {
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port,
      url: rawUrl
    }
  }

  public static httpToWsUrl = (url: string) => {
    if (UrlValidator.validate(url)) {
      return url.replace('http', 'ws')
    }
  }

  public static completeUrlWithHostAndProtocol(inputNodeValue: string): string {
    const numberOfColon = inputNodeValue.match(/:/img) ? inputNodeValue.match(/:/img).length : 0
    const pointIndex = inputNodeValue.indexOf('.')
    const colonIndex = inputNodeValue.indexOf(':')
    if (numberOfColon >= 2) return inputNodeValue
    if (numberOfColon === 0) {
      return `http://${inputNodeValue}:3000`
    }
    if (pointIndex > colonIndex) {
      return `${inputNodeValue}:3000`
    }
    if (pointIndex < colonIndex) {
      return `http://${inputNodeValue}`
    }
  }
}
