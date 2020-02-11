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
import {mapGetters} from 'vuex'
import {
  NetworkType,
  MosaicId,
  TransferTransaction,
  NamespaceId,
  Address,
  RawUInt64,
} from 'nem2-sdk'

// internal dependencies
import {TransactionViewType} from '@/services/TransactionService'
import {Formatters} from '@/core/utils/Formatters'

// configuration
import networkConfig from '@/../config/network.conf.json'

// child components
// @ts-ignore
import MosaicAmountDisplay from '@/components/MosaicAmountDisplay/MosaicAmountDisplay.vue'

@Component({
  components: {
    MosaicAmountDisplay,
  },
})
export class TransferTs extends Vue {

  @Prop({
    default: null
  }) view: TransactionViewType

  public attachedMosaics: {
    id: MosaicId,
    mosaicHex: string,
    amount: number
  }[]

/// region computed properties getter/setter
  public get mosaics() {
    return [].concat(...(this.attachedMosaics || this.view!.values.get('mosaics') || [])).map(
      ({mosaicHex, amount}) => ({
        id: this.getMosaicIdByHex(mosaicHex),
        mosaicHex,
        amount, // amount is relative
      })
    )
  }

  public set mosaics(attachments) {
    this.attachedMosaics = attachments
    this.$emit('change', attachments)
  }

  public get recipient(): string {
    const recipient = (this.view.transaction as TransferTransaction).recipientAddress
    if (recipient instanceof NamespaceId) {
      const name = (recipient as NamespaceId).fullName
      return name.length ? name : (recipient as NamespaceId).toHex()
    }
    
    return (recipient as Address).pretty()
  }

  public get message(): string {
    const message = (this.view.transaction as TransferTransaction).message
    return message.payload
  }
/// end-region computed properties getter/setter

  public getMosaicIdByHex(mosaicHex: string): MosaicId {
    return new MosaicId(RawUInt64.fromHex(mosaicHex))
  }
}
