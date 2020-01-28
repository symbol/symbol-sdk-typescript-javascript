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
import {Password} from 'nem2-sdk'
import CryptoJS from "crypto-js";

// internal dependencies
import {DatabaseModel} from './DatabaseModel'
import {BaseStorageAdapter} from './BaseStorageAdapter'
import {IDataFormatter} from './formatters/IDataFormatter'
import {JSONFormatter} from './formatters/JSONFormatter'
import {IStorageBackend} from './backends/IStorageBackend'
import {LocalStorageBackend} from './backends/LocalStorageBackend'
import {ObjectStorageBackend} from './backends/ObjectStorageBackend'
import {AESEncryptionService} from '@/services/AESEncryptionService'

export class SimpleStorageAdapter<ModelImpl extends DatabaseModel>
  extends BaseStorageAdapter<ModelImpl> {
  /**
   * Service for encryption
   * @var {AESEncryptionService}
   */
  public readonly encryption: AESEncryptionService
  
  /**
   * Construct a simple storage adapter
   * @param {IStorageBackend} storageBackend
   * @param {IDataFormatter} dataFormatter
   * @param {AESEncryptionService} encryptionService
   */
  public constructor(
    storageBackend: IStorageBackend = !!localStorage ? new LocalStorageBackend() : new ObjectStorageBackend(),
    dataFormatter: IDataFormatter<ModelImpl, string> = new JSONFormatter<ModelImpl>(),
    encryptionService: AESEncryptionService = new AESEncryptionService(),
  ) {
    super(storageBackend, dataFormatter)
    this.encryption = encryptionService
  }

  /**
   * Get session id from storage backend
   * @return {string}
   */
  public getSessionId(): string {
    let sessionId: string = this.storage.getItem('sessionId')
    if (null === sessionId) {
      // sessionId doesn't exist, generate new
      sessionId = CryptoJS.lib.WordArray.random(32).toString()

      // store sessionId
      this.storage.setItem('sessionId', sessionId)
      return sessionId
    }

    return sessionId
  }

  /**
   * Get salt for encrypted storage session
   * @return {string}
   */
  public getSaltForSession(): string {
    let sessionId: string = this.getSessionId()
    let accessSalt: string = this.storage.getItem('accessSalt')

    if (null === accessSalt) {
      // salt doesn't exist, generate new
      accessSalt = CryptoJS.lib.WordArray.random(32).toString()
  
      // encrypt salt with \a sessionId
      const ciphertext = this.encryption.encrypt(accessSalt, '', new Password(sessionId))

      // store encrypted salt
      this.storage.setItem('accessSalt', ciphertext)
      return accessSalt
    }

    // decrypt stored encrypted salt with \a sessionId
    return this.encryption.decrypt(accessSalt, '', new Password(sessionId))
  }
}
