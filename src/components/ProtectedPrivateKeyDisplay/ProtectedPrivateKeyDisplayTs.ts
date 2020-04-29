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
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import {Account} from 'symbol-sdk'
// internal dependencies
import {AccountModel} from '@/core/database/entities/AccountModel'
import {UIHelpers} from '@/core/utils/UIHelpers'
// child components
// @ts-ignore
import ModalFormProfileUnlock from '@/views/modals/ModalFormProfileUnlock/ModalFormProfileUnlock.vue'
const defaultCount: number = 10
const defaultTimerDuration: number = 1000
@Component({
  components: {
    ModalFormProfileUnlock,
  },
})
export class ProtectedPrivateKeyDisplayTs extends Vue {
  @Prop({
    default: null,
  }) account: AccountModel

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
  public secondsCounter: number = defaultCount

  // Timer
  public countInterval: any
  /// region computed properties getter/setter
  public get hasPlainPrivateKey(): boolean {
    return this.isDisplayingPrivateKey
  }

  public set hasPlainPrivateKey(f: boolean) {
    this.isDisplayingPrivateKey = f

    if (f === true) {
      // "countdown" for hiding message
      this.onStartCounter()
    }
  }

  public get hasAccountUnlockModal(): boolean {
    return this.isUnlockingAccount
  }

  public set hasAccountUnlockModal(f: boolean) {
    this.isUnlockingAccount = f
  }
  /// end-region computed properties getter/setter

  public reset(){
    this.hasPlainPrivateKey = false
    this.secondsCounter = defaultCount
    this.countInterval && clearInterval(this.countInterval)
    this.countInterval = null
    this.plainInformation = null
  }

  /**
   * Hook called when the seconds counter starts
   * @return {void}
   */
  public onStartCounter() {
    !this.countInterval && (this.countInterval = setInterval(() => {
      this.secondsCounter--
      if (this.secondsCounter < 0) {
        this.reset()
      }
    }, defaultTimerDuration))
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

  @Watch('account')
  onAccountChange(){
    this.reset()
  }
  public destroyed(){
    this.reset()
  }
}
