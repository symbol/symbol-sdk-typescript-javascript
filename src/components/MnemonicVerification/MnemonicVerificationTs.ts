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

/**
 * Emits: success, error, canceled
 */
@Component({
  components:{draggable},
})
export class MnemonicVerificationTs extends Vue {
  @Prop({ default: [] }) words: string[]

  /**
   * Randomized words
   * @var {Record<number, string>}
   */
  public shuffledWords: Record<number, string> = {}

  /**
   * Randomized words indexes
   * @var {number[]}
   */
  public shuffledWordsIndexes: number[] = []

  /**
   * Selected words indexes
   * @var {number[]}
   */
  public selectedWordIndexes: number[] = []

  /**
   * Hook called when the component is created
   * @return {void}
   */
  public created() {
    const shuffledWordsArray: string[] = [...this.words].sort((a, b) => a.localeCompare(b))
    this.shuffledWords = shuffledWordsArray.reduce(
      (acc, word, index) => ({...acc, ...{[index]: word}}), {}
    )
    this.shuffledWordsIndexes = [...Array(shuffledWordsArray.length).keys()]
  }

  /**
   * Toggle a word presence in the confirmed words
   * @param {string} word 
   * @return {void}
   */
  public onWordClicked(index: number): void {
    if (this.selectedWordIndexes.includes(index)) {
      this.removeWord(index)
      return
    }

    this.selectedWordIndexes.push(index)
  }

  /**
   * Add confirmed word
   * @param {string} word 
   * @return {string[]}
   */
  public removeWord(index: number): void {
    this.selectedWordIndexes = [...this.selectedWordIndexes].filter(sel => sel !== index)
  }

  /**
   * Process verification of mnemonic
   * @return {boolean}
   */
  public processVerification(): boolean {
    const origin = this.words.join(' ')
    const rebuilt = this.selectedWordIndexes.map(i => this.shuffledWords[i]).join(' ')

    // - origin words list does not match
    if (origin !== rebuilt) {
      const errorMsg = this.selectedWordIndexes.length < 1 ? 
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
