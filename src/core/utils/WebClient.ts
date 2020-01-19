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
import request from 'request'

export class WebClient {
  public static async request(content: string, options: request.Options) {
    const contentBuf = new Buffer(content)
    if (!options.headers) {
      options.headers = {}
    }
    options.headers['Content-Length'] = contentBuf.byteLength

    return WebClient.httpRequest(contentBuf, options)
  }

  private static async httpRequest(content: Buffer, options: request.Options) {
    let isCalled = false
    return new Promise((resolve, reject) => {
      const req = request(options, (err, res, body) => {
        if (isCalled) {
          return console.error(null, 'Multiple requests')
        }
        isCalled = true
        if (err) {
          reject(err)
        }
        resolve(body)
      })
      req.write(content)
      req.end()
    })
  }
}
