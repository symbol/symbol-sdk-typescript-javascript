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
/**
 * Storage
 */
export interface INetworkBasedStorage<E> {

  /**
   * it gets the stored value for the specific generation hash.
   *
   * @param generationHash the generation hash
   * @return the stored value for the provided network hash or undefined
   */
  get(generationHash: string): E | undefined

  /**
   * It gets the latest stored entry according to the timestamp.
   * @return the entry if available.
   */
  getLatest(): E | undefined

  /**
   * Stores the value for the provided generation hash.
   *
   * @param generationHash the generation hash
   * @param value to be stored
   */
  set(generationHash: string, value: E): void

  /**
   * Deletes the stored value for the given generation hash
   * @param generationHash the generation hash.
   */
  remove(generationHash: string): void

}
