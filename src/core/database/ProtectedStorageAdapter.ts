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
import {IEncryptionService} from '@/core/services/encryption/IEncryptionService'
import {AESEncryptionService} from '@/core/services/encryption/AESEncryptionService'
import {DatabaseModel} from './DatabaseModel'
import {IStorageBackend} from './backends/IStorageBackend'
import {ObjectStorageBackend} from './backends/ObjectStorageBackend'
import {LocalStorageBackend} from './backends/LocalStorageBackend'
import {BaseStorageAdapter} from './BaseStorageAdapter'
import {IDataFormatter} from './formatters/IDataFormatter'
import {JSONFormatter} from './formatters/JSONFormatter'

export class ProtectedStorageAdapter<ModelImpl extends DatabaseModel>
  extends BaseStorageAdapter<ModelImpl> {
  /**
   * Service for encryption
   * @var {IEncryptionService}
   */
  public readonly encryption: IEncryptionService

  /**
   * The password used for encryption
   * @var {Password}
   */
  private password: Password

  /**
   * Construct a secure storage adapter
   * @param {IStorageBackend} storageBackend
   * @param {IDataFormatter} dataFormatter
   * @param {IEncryptionService} encryption
   */
  public constructor(
    storageBackend: IStorageBackend = !!localStorage ? new LocalStorageBackend() : new ObjectStorageBackend(),
    dataFormatter: IDataFormatter<ModelImpl, string> = new JSONFormatter<ModelImpl>(),
    encryptionService: IEncryptionService = new AESEncryptionService(),
  ) {
    super(storageBackend, dataFormatter)
    this.encryption = encryptionService
  }

  /**
   * Setter for the password
   * @param {Param} password 
   * @return {ProtectedStorageAdapter<ModelImpl>}
   */
  public setPassword(password: Password): ProtectedStorageAdapter<ModelImpl> {
    this.password = password
    return this
  }

  /**
   * Getter for the password
   * @access private
   * @param {Param} password
   * @return {Password}
   */
  private getPassword(): Password {
    return this.password
  }

  /**
   * Read and parse data for schema with \a schemaId
   * @override
   * @param {string} schemaId 
   * @return {Map<string, ModelImpl>}
   */
  public read(schemaId: string): Map<string, ModelImpl> {
    // catch unregistered schema
    if (!this.schemas.has(schemaId)) {
      throw new Error('Schema with identifier \'' + schemaId + '\' is not registered.')
    }

    // catch locked access
    if (!this.password) {
      throw new Error('ProtectedStorageAdapter cannot be used without password.')
    }

    // read *encrypted* schema data from storage backend
    const schema = this.schemas.get(schemaId)
    const encrypted = this.storage.getItem(schema.tableName) || '';
    if (! encrypted.length) {
      return new Map<string, ModelImpl>();
    }

    // get/generate salt for encrypted session
    const accessSalt = this.getSaltForSession(this.getPassword())

    // attempt AES decryption with salted \a password
    const data = this.encryption.decrypt(encrypted, accessSalt, this.getPassword())

    // valid stored data to identify invalid data format
    if (!this.formatter.validate(data)) {
      throw new Error('Data stored for schema \'' + schemaId + '\' does not comply with IDataFormatter derivate.')
    }

    // map on-the-fly + validate singular entities format
    return this.formatter.parse(data)
  }

  /**
   * Read and parse data for schema with \a schemaId
   * @override
   * @param {Map<string, ModelImpl>} entities
   * @return {number} The count of entities written
   */
  public write(schemaId: string, entities: Map<string, ModelImpl>): number {
    // catch unregistered schema
    if (!this.schemas.has(schemaId)) {
      throw new Error('Schema with identifier \'' + schemaId + '\' is not registered.')
    }

    // catch locked access
    if (!this.password) {
      throw new Error('ProtectedStorageAdapter cannot be used without password.')
    }

    // encrypt the value with salted \a password
    const accessSalt = this.getSaltForSession(this.getPassword())

    // identify schema
    const schema = this.schemas.get(schemaId)

    // format data and encrypt with AES
    const data = this.formatter.format(entities)
    const ciphertext = this.encryption.encrypt(data, accessSalt, this.getPassword())

    // store the encrypted ciphertext
    this.storage.setItem(schema.tableName, ciphertext)
    return entities.size
  }

  /**
   * Get salt for encrypted storage session
   * @param {Password} password
   * @return {string}
   */
  public getSaltForSession(password: Password): string {
    let accessSalt: string = this.storage.getItem('accessSalt')
    if (null === accessSalt) {
      // salt doesn't exist, generate new
      accessSalt = CryptoJS.lib.WordArray.random(32).toString()
  
      // encrypt salt with \a password
      const ciphertext = this.encryption.encrypt(accessSalt, '', this.getPassword())

      // store encrypted salt
      this.storage.setItem('accessSalt', ciphertext)
      return accessSalt
    }

    // decrypt stored encrypted salt with \a password
    return this.encryption.decrypt(accessSalt, '', this.getPassword())
  }
}
