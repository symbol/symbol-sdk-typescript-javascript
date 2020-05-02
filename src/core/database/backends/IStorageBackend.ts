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
export interface IStorageBackend {
  /**
   * The number of available entries
   * @var {number}
   */
  length: number

  /**
   * Getter for value with \a key
   * @param {string} key
   * @return {string|null}
   */
  getItem(key: string): any

  /**
   * Setter for \a key with \a value
   * @param {string} key
   * @param {any} value
   */
  setItem(key: string, value: any): void

  /**
   * Deletes the value for the given key
   * @param {string} key
   */
  removeItem(key: string): void
}
