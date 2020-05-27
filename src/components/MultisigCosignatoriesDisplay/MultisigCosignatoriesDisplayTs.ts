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
// external dependencies
import { Component, Prop, Vue } from 'vue-property-decorator'
import { MultisigAccountInfo, PublicAccount } from 'symbol-sdk'

// child components
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue'
// @ts-ignore
import AddCosignatoryInput from '@/components/AddCosignatoryInput/AddCosignatoryInput.vue'

// custom types
type AddOrRemove = 'add' | 'remove'

interface Modification {
  cosignatory: PublicAccount
  addOrRemove: AddOrRemove
}

type Cosignatories = { publicKey: string; address: string }[]

@Component({
  components: {
    FormRow,
    AddCosignatoryInput,
  },
})
export class MultisigCosignatoriesDisplayTs extends Vue {
  @Prop({ default: null }) multisig: MultisigAccountInfo
  @Prop({ default: false }) modifiable: boolean
  @Prop({ default: {} }) cosignatoryModifications: Record<string, Modification>

  /**
   * Whether the add cosignatory form input is visible
   */
  protected isAddingCosignatory = false

  /**
   * Cosignatories to add
   * @type {Cosignatories}
   */
  protected get addModifications(): Cosignatories {
    return this.getFilteredModifications('add')
  }

  /**
   * Cosignatories to remove
   * @type {Cosignatories}
   */
  protected get removeModifications(): Cosignatories {
    return this.getFilteredModifications('remove')
  }

  /**
   * Internal helper to get filtered cosignatory modifications
   * @param {AddOrRemove} addOrRemoveFilter
   * @returns {Cosignatories}
   */
  private getFilteredModifications(addOrRemoveFilter: AddOrRemove): Cosignatories {
    return Object.values(this.cosignatoryModifications)
      .filter(({ addOrRemove }) => addOrRemove === addOrRemoveFilter)
      .map(({ cosignatory }) => ({
        publicKey: cosignatory.publicKey,
        address: cosignatory.address.pretty(),
      }))
  }

  /**
   * The multisig account cosignatories after modifications
   * @type {{ publicKey: string; address: string }[]}
   */
  protected get cosignatories(): { publicKey: string; address: string }[] {
    if (!this.multisig) return []

    return this.multisig.cosignatories
      .filter(({ publicKey }) => !this.cosignatoryModifications[publicKey])
      .map(({ publicKey, address }) => ({ publicKey, address: address.pretty() }))
  }

  /**
   * Hook called when a cosignatory is added
   * @param {PublicAccount} publicAccount
   */
  protected onAddCosignatory(publicAccount: PublicAccount): void {
    const { publicKey } = publicAccount
    const isCosignatory = this.cosignatories.find((a) => a.publicKey === publicKey)

    if (isCosignatory || this.cosignatoryModifications[publicKey]) {
      this.$store.dispatch('notification/ADD_WARNING', 'warning_already_a_cosignatory')
      return
    }

    this.$emit('add', publicAccount)
  }

  /**
   * Hook called when a cosignatory is removed
   * @param {string} publicKey
   */
  protected onRemoveCosignatory(publicKey: string): void {
    this.$emit('remove', publicKey)
  }

  /**
   * Hook called when a cosignatory modification is undone
   * @param {string} thePublicKey
   */
  protected onUndoModification(thePublicKey: string): void {
    this.$emit('undo', thePublicKey)
  }
}
