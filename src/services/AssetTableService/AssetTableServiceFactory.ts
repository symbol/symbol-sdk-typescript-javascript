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
import {AssetType, AssetTableService} from './AssetTableService'
import {MosaicTableService} from './MosaicTableService'
import {NamespaceTableService} from './NamespaceTableService'

export class AssetTableServiceFactory {
/**
  * Returns an Asset Table Service according to provided asset type
  * @static
  * @param {*} store
  * @param {AssetType} assetType
  * @returns {AssetTableService}
  */
  public static getService(store: any, assetType: AssetType): AssetTableService {
    if (assetType === 'mosaic') return new MosaicTableService(store)
    return new NamespaceTableService(store)
  }
}
