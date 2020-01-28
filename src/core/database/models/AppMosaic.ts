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
import {MosaicInfo} from 'nem2-sdk'

// internal dependencies
import {SimpleStorageAdapter} from '@/core/database/SimpleStorageAdapter'
import {MosaicsModel} from '@/core/database/entities/MosaicsModel'
import {AppDatabase} from '@/core/database/AppDatabase'

export class AppMosaic {
  /**
   * Model instance
   * @var {MosaicsModel}
   */
  public model: MosaicsModel

  /**
   * Storage adapter
   * @var {SimpleStorageAdapter}
   */
  protected adapter: SimpleStorageAdapter

  constructor(
    public store: Store<any>,
    public walletName: string,
    public hexId: string,
    public name: string,
    public info: MosaicInfo,
  ) {
    // get storage adapter
    this.adapter = AppDatabase.getAdapter()

    // populate model
    this.model = new MosaicsModel(new Map<string, any>([
      ['wallet', this.walletName],
      ['hexId', this.hexId],
      ['name', this.name],
      ['info', JSON.stringify(this.info)],
    ]))
  }

  public get divisibility(): number {
    return this.model.info().divisibility
  }
}
