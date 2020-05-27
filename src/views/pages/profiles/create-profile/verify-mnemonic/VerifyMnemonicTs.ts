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
import { Component, Vue } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { MnemonicPassPhrase } from 'symbol-hd-wallets'
// internal dependencies
// child components
// @ts-ignore
import MnemonicVerification from '@/components/MnemonicVerification/MnemonicVerification.vue'
import { NotificationType } from '@/core/utils/NotificationType'

@Component({
  components: {
    MnemonicVerification,
  },
  computed: {
    ...mapGetters({
      currentMnemonic: 'temporary/mnemonic',
    }),
  },
})
export default class VerifyMnemonicTs extends Vue {
  /**
   * Temporary Mnemonic pass phrase
   * @var {MnemonicPassPhrase}
   */
  public currentMnemonic: MnemonicPassPhrase

  /// region computed properties getter/setter
  get mnemonicWordsList(): string[] {
    if (this.currentMnemonic) {
      return this.currentMnemonic.plain.split(' ')
    }
    this.$store.dispatch('notification/ADD_ERROR', NotificationType.NO_MNEMONIC_INFO)
    this.$router.push({ name: 'profiles.createProfile.info' })
  }

  /// end-region computed properties getter/setter
}
