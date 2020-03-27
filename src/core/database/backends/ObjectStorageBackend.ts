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
import {IStorageBackend} from './IStorageBackend'

export class ObjectStorageBackend implements IStorageBackend {
  /**
   * The storage backend (a simple object)
   * @var {any}
   */
  protected backend: any = {}

  /**
   * Construct an object storage backend
   * @param backend 
   */
  public constructor(backend: any = {}) {
    this.backend = backend
  }

  /**
   * The number of available entries
   * @var {number}
   */
  public get length(): number {
    return Object.keys(this.backend).length
  }

  /**
   * Always returns true for "backend as an object"
   * @return {boolean}
   */
  public isAvailable(): boolean {
    return true
  }

  /**
   * Getter for value with \a key
   * @param {string} key 
   * @return {any}
   */
  public getItem(key: string): any {
    if (!this.backend || !this.backend[key]) {
      return null
    }

    return this.backend[key]
  }

  /**
   * Setter for \a key with \a value
   * @param {string} key
   * @param {any} value
   */
  public setItem(key: string, value: any): void {
    this.backend[key] = value
  }
}
