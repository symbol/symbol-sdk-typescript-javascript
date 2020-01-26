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
import {Component, Prop, Vue} from 'vue-property-decorator'
import draggable from 'vuedraggable'

// internal dependencies
import {NotificationType} from '@/core/utils/NotificationType'

/// region helpers
/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
/// end-region helpers

/**
 * Emits: success, error, canceled
 */
@Component({
  components:{draggable},
})
export class MnemonicVerificationTs extends Vue {
  @Prop({
    default: []
  })
  words: string[]

  /**
   * Randomized words
   * @var {string[]}
   */
  public shuffledWords: string[] = []

  /**
   * Selected words
   * @var {string[]}
   */
  public selectedWords: string[] = []

  /**
   * Hook called when the component is mounted
   * @return {void}
   */
  public mounted() {
    this.shuffledWords = shuffle([...this.words])
  }

  /**
   * Add confirmed word
   * @param {string} word 
   * @return {string[]}
   */
  public addWord(word: string): string[] {
    if (this.selectedWords.includes(word)) {
      this.removeWord(word)
      return
    }

    this.selectedWords.push(word)
    return this.selectedWords
  }

  /**
   * Add confirmed word
   * @param {string} word 
   * @return {string[]}
   */
  public removeWord(word: string) {
    this.selectedWords = this.selectedWords.filter(sel => sel !== word)
    return this.selectedWords
  }

  /**
   * Process verification of mnemonic
   * @return {boolean}
   */
  public processVerification(): boolean {
    const origin = this.words.join(' ')
    const rebuilt = this.selectedWords.join(' ')

    // - origin words list does not match
    if (origin !== rebuilt) {
      const errorMsg = this.selectedWords.length < 1 ? 
              NotificationType.PLEASE_ENTER_MNEMONIC_INFO
            : NotificationType.MNEMONIC_INCONSISTENCY_ERROR
      this.$store.dispatch('notification/ADD_WARNING', errorMsg)
      this.$emit('error', errorMsg)
      return false
    }

    this.$store.dispatch('notification/ADD_SUCCESS', NotificationType.SUCCESS)
    this.$emit('success')
    return true
  }
}
