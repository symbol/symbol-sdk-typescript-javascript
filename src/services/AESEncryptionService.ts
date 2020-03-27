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
import {Password} from 'symbol-sdk'
import CryptoJS from 'crypto-js'

// internal dependencies
import {AbstractService} from './AbstractService'

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
  constructor(store?: Store<any>) {
    super()
    this.$store = store
  }

  /**
   * Encrypt data
   * @param {string} data 
   * @param {string} salt 
   * @param {Password} password 
   */
  public static encrypt(
    data: string,
    password: Password,
  ): string {
    const salt = CryptoJS.lib.WordArray.random(16)

    // generate password based key
    const key = CryptoJS.PBKDF2(password.value, salt, {
      keySize: 8,
      iterations: 1024,
    })

    // encrypt using random IV
    const iv = CryptoJS.lib.WordArray.random(16)
    const encrypted = CryptoJS.AES.encrypt(data, key, { 
      iv: iv, 
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    })

    // salt (16 bytes) + iv (16 bytes)
    // prepend them to the ciphertext for use in decryption
    return salt.toString() + iv.toString() + encrypted.toString()
  }

  /**
   * Decrypt data
   * @param {string} data 
   * @param {string} salt 
   * @param {Password} password 
   */
  public static decrypt(
    data: string,
    password: Password,
  ): string {
    const salt = CryptoJS.enc.Hex.parse(data.substr(0, 32))
    const iv = CryptoJS.enc.Hex.parse(data.substr(32, 32))
    const encrypted = data.substring(64)

    // generate password based key
    const key = CryptoJS.PBKDF2(password.value, salt, {
      keySize: 8,
      iterations: 1024,
    })

    // decrypt using custom IV
    const decrypted = CryptoJS.AES.decrypt(encrypted, key, { 
      iv: iv, 
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    })

    return decrypted.toString(CryptoJS.enc.Utf8)
  }

  /**
   * Generate \a count random bytes
   * @param {number} count 
   * @param {boolean} raw 
   * @return {string}
   */
  public static generateRandomBytes(
    count: number,
    raw: boolean = false,
  ): string {
    const bytes = CryptoJS.lib.WordArray.random(count)
    if (raw === true) return bytes

    return CryptoJS.enc.Hex.stringify(bytes)
  }
}
