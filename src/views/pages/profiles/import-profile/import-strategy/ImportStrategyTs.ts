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
import Vue from 'vue'
import Component from 'vue-class-component'
// resources
import {walletTypeImages} from '@/views/resources/Images'

@Component
export default class ImportStrategyTs extends Vue {
  /**
   * List of available follow-up pages
   * @var {any[]}
   */
  public importInfoList = [
    {
      image: walletTypeImages.createImg,
      title: 'create_mnemonic',
      description: 'create_a_new_profile',
      route: 'profiles.createProfile.info',
    },
    {
      image: walletTypeImages.seedImg,
      title: 'import_mnemonic',
      description: 'import_mnemonic_passphrase_create_profile',
      route: 'profiles.importProfile.info',
    },
    {
      image: walletTypeImages.trezorImg,
      title: 'access_trezor',
      description: 'access_trezor_account',
      route: null,
    },
    {
      image: walletTypeImages.ledgerImg,
      title: 'access_ledger',
      description: 'access_your_ledger_account',
      route: null,
    },
  ]

  /**
   * Redirect user to clicked route
   * @param link
   */
  public redirect(routeName: string) {
    if (!routeName || !routeName.length) {
      return this.$store.dispatch('notification/ADD_WARNING', this.$t('not_yet_open'))
    }

    return this.$router.push({
      name: routeName,
      params: {
        nextPage: 'profiles.importProfile.importMnemonic',
      },
    })
  }
}
