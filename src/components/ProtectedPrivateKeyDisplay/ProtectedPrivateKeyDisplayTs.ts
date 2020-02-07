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
import {Account, EncryptedPrivateKey} from 'nem2-sdk'

// internal dependencies
import {WalletsModel} from '@/core/database/entities/WalletsModel'

// child components
// @ts-ignore
import ModalFormAccountUnlock from '@/views/modals/ModalFormAccountUnlock/ModalFormAccountUnlock.vue'

@Component({
  components: {
    ModalFormAccountUnlock,
  }
})
export class ProtectedPrivateKeyDisplayTs extends Vue {
  @Prop({
    default: null
  }) wallet: WalletsModel

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

/// region computed properties getter/setter
  public get hasPlainPrivateKey(): boolean {
    return this.isDisplayingPrivateKey
  }

  public set hasPlainPrivateKey(f: boolean) {
    this.isDisplayingPrivateKey = f

    if (f === true) {
      // - private key hidden after 10 seconds
      setTimeout(() => {
        this.hasPlainPrivateKey = false
      }, 10000) // 10 seconds
    }
  }

  public get hasAccountUnlockModal(): boolean {
    return this.isUnlockingAccount
  }

  public set hasAccountUnlockModal(f: boolean) {
    console.log("changing hasAccountUnlockModal: ", f)
    this.isUnlockingAccount = f
  }
/// end-region computed properties getter/setter

  /**
   * Decrypt the stored key
   */
  public decryptKey() {
    const encPrivate = new EncryptedPrivateKey(
      this.wallet.values.get('encPrivate'),
      this.wallet.values.get('encIv'),
    )

    // ...


    // remove decrypted copy from memory
    setTimeout(() => {
      this.hasPlainPrivateKey = false
    }, 10000) // 10 seconds

    return 'plaintext'
  }

  public onClickDisplay() {
    this.hasAccountUnlockModal = true
  }

  public onAccountUnlocked(account: Account) {
    this.hasPlainPrivateKey = true
    console.log("ProtectedPrivateKeyDisplay unlocked: ", account.privateKey)
    return true
  }
}
