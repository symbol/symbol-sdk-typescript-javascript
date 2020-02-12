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
import {MosaicId, MosaicInfo, AccountInfo} from 'nem2-sdk'

// internal dependencies
import {AbstractService} from './AbstractService'
import {SettingsRepository} from '@/repositories/SettingsRepository'
import {SettingsModel} from '@/core/database/entities/SettingsModel'

export class SettingService extends AbstractService {
  /**
   * Service name
   * @var {string}
   */
  public name: string = 'setting'

  /**
   * Vuex Store 
   * @var {Vuex.Store}
   */
  public $store: Store<any>

  /**
   * Construct a service instance around \a store
   * @param store
   */
  constructor(store?: Store<any>) {
    super()
    this.$store = store
  }

  /**
   * Save settings
   * @param {MosaicId} mosaicId 
   * @return {Promise<MosaicInfo>}
   */
  public saveSettingsForm(
    formItems: {
      currentLanguage: string,
      explorerUrl: string,
      maxFee: number
    }
  ) {
    // - prepare
    const currentAccount = this.$store.getters['account/currentAccount']
    const repository = new SettingsRepository()
    const values = new Map<string, any>([
      ['language', formItems.currentLanguage],
      ['default_fee', formItems.maxFee],
      ['explorer_url', formItems.explorerUrl],
    ])

    // - UPDATE when possible
    if (repository.find(currentAccount.getIdentifier())) {
      repository.update(currentAccount.getIdentifier(), values)
    }
    // - CREATE Just in Time
    else {
      values.set('accountName', currentAccount.getIdentifier())
      repository.create(values)
    }

    // - update store state
    this.$store.dispatch('app/SET_LANGUAGE', formItems.currentLanguage)
    this.$store.dispatch('app/SET_EXPLORER_URL', formItems.explorerUrl)
    this.$store.dispatch('app/SET_DEFAULT_FEE', formItems.maxFee)
    return true
  }
}
