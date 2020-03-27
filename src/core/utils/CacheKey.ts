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
import {Convert, SHA3Hasher} from 'symbol-sdk'

export class CacheKey {

  /**
   * Cache key query arguments
   * @var {any[]}
   */
  protected argv: any[]

  /**
   * Construct a cache key instance
   * @param {any[]} args 
   */
  private constructor(...args) {
    this.argv = args
  }

  /**
   * Create a cache key around \a args
   * @param {any[]} args 
   * @return {string}
   */
  public static create(...args): string {
    const key = new CacheKey(args)
    return key.getHash()
  }

  /**
   * Compute the cache key using arguments
   * @return {string}
   */
  public getHash(): string {
    const query = this.argv.reduce(
      (prev, cur) => `${prev},${cur}`)

    // create query hash
    const hash = new Uint8Array(64)
    const hasher = SHA3Hasher.createHasher(64)
    hasher.reset()
    hasher.update(Buffer.from(query))
    hasher.finalize(hash)

    // return hexadecimal notation of hash
    return Convert.uint8ToHex(hash)
  }
}
