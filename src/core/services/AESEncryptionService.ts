/**
 * 
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
import { Password } from 'nem2-sdk'
import CryptoJS from "crypto-js";

// internal dependencies
import { IService } from '@/core/services/IService'
import { IEncryptionService } from '@/core/services/encryption/IEncryptionService'

export class AESEncryptionService implements IEncryptionService, IService {
  /**
   * Service name
   * @var {string}
   */
  public name: string = 'encryption'

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
}
