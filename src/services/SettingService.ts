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

// internal dependencies
import {AbstractService} from './AbstractService'
import {SettingsRepository} from '@/repositories/SettingsRepository'
import {SettingsModel} from '@/core/database/entities/SettingsModel'
import {AccountsModel} from '@/core/database/entities/AccountsModel'
import i18n from '@/language'

// configuration
import feesConfig from '@/../config/fees.conf.json'
import networkConfig from '@/../config/network.conf.json'

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
   * Getter for the collection of items
   * mapped by identifier
   * @return {Map<string, SettingsModel>}
   */
  public allSettings(
    filterFn: (
      value: SettingsModel,
      index: number,
      array: SettingsModel[]
    ) => boolean = () => true,
  ): SettingsModel[] {
    const repository = new SettingsRepository()
    return repository.collect().filter(filterFn)
  }

  /**
   * Get settings for \a account
   * @param {AccountsModel} account 
   * @return {SettingsModel}
   */
  public getSettings(account: AccountsModel): SettingsModel {
    const repository = new SettingsRepository()

    // - read settings from storage if available
    if (repository.find(account.getIdentifier())) {
      return repository.read(account.getIdentifier())
    }

    // - defaults
    return repository.createModel(new Map<string, any>([
      [ 'explorer_url', networkConfig.explorerUrl ],
      [ 'default_fee', feesConfig.normal ],
      [ 'default_wallet', '' ],
      [ 'language', i18n.locale ],
    ]))
  }

  /**
   * Save settings
   * @param {MosaicId} mosaicId 
   * @return {Promise<MosaicInfo>}
   */
  public saveSettingsForm(
    formItems: {
      currentLanguage: string
      explorerUrl: string
      maxFee: number
      defaultWallet: string
    },
  ) {
    // - prepare
    const currentAccount = this.$store.getters['account/currentAccount']
    const repository = new SettingsRepository()
    const values = new Map<string, any>([
      [ 'language', formItems.currentLanguage ],
      [ 'default_fee', formItems.maxFee ],
      [ 'explorer_url', formItems.explorerUrl ],
      [ 'default_wallet', formItems.defaultWallet ],
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
    this.$store.dispatch('app/SET_DEFAULT_WALLET', formItems.defaultWallet)
    return true
  }
}
