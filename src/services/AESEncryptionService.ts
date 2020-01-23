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
import {Store} from 'vuex'
import {Password} from 'nem2-sdk'
import CryptoJS from "crypto-js";

// internal dependencies
import { AbstractService } from './AbstractService'

export class AESEncryptionService extends AbstractService {
  /**
   * Service name
   * @var {string}
   */
  public name: string = 'encryption'

  /**
   * Vuex Store 
   * @var {Vuex.Store}
   */
  public $store: Store<any>

  /**
   * Construct a service instance around \a store
   * @param store
   */
  constructor(store: Store<any>) {
    super(store)
  }

  /**
   * Encrypt data
   * @param {string} data 
   * @param {string} salt 
   * @param {Password} password 
   */
  public encrypt(
    data: string,
    salt: string,
    password: Password,
  ): string {
    const payload = CryptoJS.AES.encrypt(data, salt + password.value)
    return payload.toString()
  }

  /**
   * Decrypt data
   * @param {string} data 
   * @param {string} salt 
   * @param {Password} password 
   */
  public decrypt(
    data: string,
    salt: string,
    password: Password
  ): string {
    return CryptoJS.AES.decrypt(data, salt + password.value).toString()
  }

  /**
   * Generate \a count random bytes
   * @param {number} count 
   * @param {boolean} raw 
   * @return {string}
   */
  public generateRandomBytes(
    count: number,
    raw: boolean = false
  ): string {
    const bytes = CryptoJS.lib.WordArray.random(count)
    if (raw === true) return bytes

    return CryptoJS.enc.Hex.stringify(bytes)
  }
}
