/*
 * Copyright 2020 NEM Foundation (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
// external dependencies
import { Convert, Crypto, SHA3Hasher } from 'symbol-sdk'

// internal dependencies
import { IStorageBackend } from '@/core/database/backends/IStorageBackend'
import { LocalStorageBackend } from '@/core/database/backends/LocalStorageBackend'
import { ObjectStorageBackend } from '@/core/database/backends/ObjectStorageBackend'
import { IStorage } from '@/core/database/backends/IStorage'

/**
 * A super simple object storage that keeps one object in a local storage table.
 *
 * This object is generic, you can type it with the class of object that it's going to be stored.
 * The object could be a simple object, an array or a Map/Record with key->value.
 *
 */
export class SimpleObjectStorage<E> implements IStorage<E> {
  /**
   * The Storage backend, if localStorage is not available the storage will be in memory.
   */
  private readonly storageBackend: IStorageBackend

  public constructor(private readonly storageKey) {
    this.storageBackend = !!localStorage ? new LocalStorageBackend() : new ObjectStorageBackend()
  }

  /**
   * @return the stored value or undefined
   */
  public get(): E | undefined {
    const item = this.storageBackend.getItem(this.storageKey)
    return item ? JSON.parse(item) : undefined
  }

  /**
   * Stores the provided value.
   * @param value to be stored
   */
  public set(value: E): void {
    this.storageBackend.setItem(this.storageKey, JSON.stringify(value))
  }

  /**
   * Deletes the stored value.
   */
  public remove(): void {
    this.storageBackend.removeItem(this.storageKey)
  }

  /**
   * Helper that generates an identifier base on the object value
   *
   * @param object the object used feed the generator.
   */
  public static generateIdentifier(object: object | undefined = undefined): string {
    const raw = {
      ...{
        time: new Date().valueOf(),
        seed: Crypto.randomBytes(8),
      },
      ...(object || {}),
    }
    // to-json
    const json = JSON.stringify(raw)
    const hasher = SHA3Hasher.createHasher(64)
    hasher.reset()
    hasher.update(Convert.utf8ToHex(json))

    const hash = new Uint8Array(64)
    hasher.finalize(hash)
    return Convert.uint8ToHex(hash).substr(0, 16)
  }
}
