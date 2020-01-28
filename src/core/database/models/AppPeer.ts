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
import {NetworkType} from 'nem2-sdk'

// internal dependencies
import {SimpleStorageAdapter} from '@/core/database/SimpleStorageAdapter'
import {PeersModel} from '@/core/database/entities/PeersModel'
import {AppDatabase} from '@/core/database/AppDatabase'

export class AppPeer {
  /**
   * Model instance
   * @var {PeersModel}
   */
  public model: PeersModel

  /**
   * Storage adapter
   * @var {SimpleStorageAdapter}
   */
  protected adapter: SimpleStorageAdapter

  constructor(
    public store: Store<any>,
    public host: string,
    public port: number,
    public protocol: string,
    public networkType: NetworkType,
  ) {
    // get storage adapter
    this.adapter = AppDatabase.getAdapter()

    // populate model
    this.model = new PeersModel(new Map<string, any>([
      ['host', this.host],
      ['port', this.port],
      ['protocol', this.protocol],
      ['networkType', this.networkType],
    ]))
  }
}
