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
import {URLInfo} from '@/core/utils/URLInfo'

export class URLHelpers {

  public static formatUrl = (rawUrl: string): URLInfo => {
    if (!UrlValidator.validate(rawUrl)) {
      throw new Error(`Invalid URL: ${rawUrl}`)
    }
    const url = new URL(rawUrl)
    return new URLInfo(
      url.protocol,
      url.hostname,
      url.port,
      rawUrl,
    )
  }

  public static httpToWsUrl = (url: string) => {
    if (UrlValidator.validate(url)) {
      return url.replace('http', 'ws')
    }
  }

  /**
   * Get full node url and add missing pieces
   * @param {string} fromUrl
   * @return {string}
   */
  public static getNodeUrl(fromUrl: string): string {
    let fixedUrl = -1 === fromUrl.indexOf('://')
      ? 'http://' + fromUrl
      : fromUrl

    fixedUrl = !fixedUrl.match(/https?:\/\/[^:]+:([0-9]+)\/?$/)
      ? fixedUrl + ':3000' // default adds :3000
      : fixedUrl

    const url = URLHelpers.formatUrl(fixedUrl)
    return url.protocol + '//' + url.hostname + (url.port ? ':' + url.port : ':3000')
  }
}
