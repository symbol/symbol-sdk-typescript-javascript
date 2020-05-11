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
import { mapGetters } from 'vuex'
import { Component, Vue } from 'vue-property-decorator'
import { MnemonicPassPhrase } from 'symbol-hd-wallets'
// @ts-ignore
import MnemonicDisplay from '@/components/MnemonicDisplay/MnemonicDisplay.vue'
// @ts-ignore
import ButtonCopyToClipboard from '@/components/ButtonCopyToClipboard/ButtonCopyToClipboard.vue'
import { Formatters } from '@/core/utils/Formatters'
import { ProfileModel } from '@/core/database/entities/ProfileModel'

@Component({
  components: { MnemonicDisplay, ButtonCopyToClipboard },
  computed: {
    ...mapGetters({
      currentProfile: 'profile/currentProfile',
      currentMnemonic: 'temporary/mnemonic',
    }),
  },
})
export default class ShowMnemonicTs extends Vue {
  /**
   * Currently active profile
   * @see {Store.Profile}
   * @var {string}
   */
  public currentProfile: ProfileModel

  /**
   * Temporary Mnemonic pass phrase
   * @var {MnemonicPassPhrase}
   */
  public currentMnemonic: MnemonicPassPhrase

  /**
   * Whether mnemonic is shown in plain text
   * @var {boolean}
   */
  public showMnemonic: boolean = false

  /// region computed properties getter/setter
  get mnemonicWordsList() {
    return this.currentMnemonic.plain.split(' ')
  }
  public get waitingCopyString(): string {
    return Formatters.splitArrayByDelimiter(this.mnemonicWordsList)
  }
  /// end-region computed properties getter/setter
}
