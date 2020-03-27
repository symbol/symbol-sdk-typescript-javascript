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
import {Component, Vue, Prop} from 'vue-property-decorator'
import {Account} from 'symbol-sdk'

// internal dependencies
import {WalletsModel} from '@/core/database/entities/WalletsModel'
import {UIHelpers} from '@/core/utils/UIHelpers'

// child components
// @ts-ignore
import ModalFormAccountUnlock from '@/views/modals/ModalFormAccountUnlock/ModalFormAccountUnlock.vue'

@Component({
  components: {
    ModalFormAccountUnlock,
  },
})
export class ProtectedPrivateKeyDisplayTs extends Vue {
  @Prop({
    default: null,
  }) wallet: WalletsModel

  /**
   * UI Helpers
   * @var {UIHelpers}
   */
  public uiHelpers = UIHelpers

  /**
   * Whether account is currently being unlocked
   * @var {boolean}
   */
  public isUnlockingAccount: boolean = false

  /**
   * Whether private key is currently displayed
   * @var {boolean}
   */
  public isDisplayingPrivateKey: boolean = false

  /**
   * Plain private key information
   * @internal
   * @var {string}
   */
  private plainInformation: string = ''

  /**
   * seconds counter
   * @internal
   * @var {number}
   */
  public secondsCounter: number = 10

  /// region computed properties getter/setter
  public get hasPlainPrivateKey(): boolean {
    return this.isDisplayingPrivateKey
  }

  public set hasPlainPrivateKey(f: boolean) {
    this.isDisplayingPrivateKey = f

    if (f === true) {
      // "countdown" for hiding message
      const cntInterval = this.onStartCounter()

      // - private key hidden after 10 seconds
      this.onHideTimeout(this.secondsCounter, cntInterval)
    }
  }

  public get hasAccountUnlockModal(): boolean {
    return this.isUnlockingAccount
  }

  public set hasAccountUnlockModal(f: boolean) {
    this.isUnlockingAccount = f
  }
  /// end-region computed properties getter/setter

  /**
   * Hook called when the seconds counter starts
   * @return {void}
   */
  public onStartCounter() {
    let cntInterval = null
    cntInterval = setInterval(() => {
      this.secondsCounter = this.secondsCounter - 1
      if (this.secondsCounter < 0) {
        this.secondsCounter = 0
        clearInterval(cntInterval)
      }
    }, 999)
    return cntInterval
  }

  /**
   * Hook called when the hide timeout starts
   * @return {void}
   */
  public onHideTimeout(seconds, counterInterval) {
    // - private key hidden after 10 seconds
    setTimeout(() => {
      this.hasPlainPrivateKey = false
      clearInterval(counterInterval)
      this.secondsCounter = 10
    }, seconds * 1000)
  }

  /**
   * Hook called when the account unlock modal must open
   * @return {void}
   */
  public onClickDisplay() {
    this.hasAccountUnlockModal = true
  }

  /**
   * Hook called when the account has been unlocked
   * @param {Account} account 
   * @return {boolean}
   */
  public onAccountUnlocked(account: Account): boolean {
    this.hasPlainPrivateKey = true
    this.hasAccountUnlockModal = false
    this.plainInformation = account.privateKey
    return true
  }
}
