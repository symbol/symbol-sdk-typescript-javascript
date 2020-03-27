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

// internal dependencies
import {WalletsModel} from '@/core/database/entities/WalletsModel'

// child components
// @ts-ignore
import ModalFormAccountUnlock from '@/views/modals/ModalFormAccountUnlock/ModalFormAccountUnlock.vue'
// @ts-ignore
import ProtectedMnemonicQRButton from '@/components/ProtectedMnemonicQRButton/ProtectedMnemonicQRButton.vue'
// @ts-ignore
import ProtectedMnemonicDisplayButton from '@/components/ProtectedMnemonicDisplayButton/ProtectedMnemonicDisplayButton.vue'

@Component({
  components: {
    ModalFormAccountUnlock,
    ProtectedMnemonicQRButton,
    ProtectedMnemonicDisplayButton,
  }})
export class WalletBackupOptionsTs extends Vue {

  @Prop({
    default: null,
  }) wallet: WalletsModel

  /**
   * Whether account is currently being unlocked
   * @var {boolean}
   */
  public isUnlockingAccount: boolean = false

  /// region computed properties getter/setter
  public get hasAccountUnlockModal(): boolean {
    return this.isUnlockingAccount
  }

  public set hasAccountUnlockModal(f: boolean) {
    this.isUnlockingAccount = f
  }
  /// end-region computed properties getter/setter

}
