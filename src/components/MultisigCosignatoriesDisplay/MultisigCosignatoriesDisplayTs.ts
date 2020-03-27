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
// external dependencies
import {Component, Vue, Prop} from 'vue-property-decorator'
import {mapGetters} from 'vuex'
import {Address, NetworkType, MultisigAccountInfo, PublicAccount} from 'symbol-sdk'

// child components
import {ValidationProvider} from 'vee-validate'
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue'
// @ts-ignore
import AddCosignatoryInput from '@/components/AddCosignatoryInput/AddCosignatoryInput.vue'

// custom types
interface Modification {
  cosignatory: PublicAccount
  addOrRemove: 'add' | 'remove'
}

@Component({
  components: {
    ValidationProvider,
    FormRow,
    AddCosignatoryInput,
  },
  computed: {...mapGetters({
    networkType: 'network/networkType',
  })},
})
export class MultisigCosignatoriesDisplayTs extends Vue {
  @Prop({ default: null }) multisig: MultisigAccountInfo

  @Prop({ default: false }) modifiable: boolean

  @Prop({ default: {} }) cosignatoryModifications: Record<string, Modification>

  private networkType: NetworkType

  public isAddingCosignatory: boolean = false
  public addedActors: {publicKey: string, address: string}[] = []
  public removedActors: {publicKey: string, address: string}[] = []

  get cosignatories(): {publicKey: string, address: string}[] {
    if (!this.multisig) return []

    return Object.values(this.multisig.cosignatories).filter(c => {
      return undefined === this.removedActors.find(m => m.publicKey === c.publicKey)
    }).map(
      (cosignatory) => ({
        publicKey: cosignatory.publicKey,
        address: cosignatory.address.pretty(),
      }))
  }

  get addModifications(): {publicKey: string, address: string}[] {
    return Object.values(this.cosignatoryModifications)
      .filter(({addOrRemove}) => addOrRemove === 'add')
      .map(({cosignatory}) => ({
        publicKey: cosignatory.publicKey,
        address: cosignatory.address.pretty(),
      }))
  }

  get removeModifications(): {publicKey: string, address: string}[] {
    return Object.values(this.cosignatoryModifications)
      .filter(({addOrRemove}) => addOrRemove === 'remove')
      .map(({cosignatory}) => ({
        publicKey: cosignatory.publicKey,
        address: cosignatory.address.pretty(),
      }))
  }

  public onAddCosignatory(publicAccount: PublicAccount) {
    const exists = this.cosignatories.find(a => a.publicKey === publicAccount.publicKey)
    const existsMod = this.addedActors.find(a => a.publicKey === publicAccount.publicKey)
    if (exists !== undefined || existsMod !== undefined) {
      this.$store.dispatch('notification/ADD_WARNING', 'warning_already_a_cosignatory')
      return 
    }

    this.$emit('add', publicAccount)
    this.isAddingCosignatory = false
  }

  public onRemoveCosignatory(publicKey: string) {
    this.removedActors.push({
      publicKey,
      address: Address.createFromPublicKey(
        publicKey,
        this.networkType,
      ).pretty(),
    })
    this.$emit('remove', publicKey)
  }

  public onRemoveModification(publicKey: string) {
    this.$emit('undo', publicKey)
  }

  public onUndoRemoveModification(publicKey: string) {
    this.$emit('undo', publicKey)
  }
}
