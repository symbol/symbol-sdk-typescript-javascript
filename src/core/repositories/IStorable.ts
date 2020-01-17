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
import {DatabaseModel} from '@/core/services/database/DatabaseModel'
import {BaseStorageAdapter} from '@/core/services/database/BaseStorageAdapter'

export interface IStorable<
  ModelImpl extends DatabaseModel,
  StorageAdapterImpl extends BaseStorageAdapter<ModelImpl>
> {
  /**
   * Getter for the storage adapter
   * @return {StorageAdapterImpl}
   */
  getAdapter(): StorageAdapterImpl

  /**
   * Setter for the storage adapter
   * @param {StorageAdapterImpl} adapter
   * @return {IStorable<ModelImpl, StorageAdapterImpl>}
   */
  setAdapter(adapter: StorageAdapterImpl): IStorable<ModelImpl, StorageAdapterImpl>
}
