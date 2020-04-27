<template>
  <div class="transaction-details-item-inner-container">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="transaction-row-outer-container"
    >
      <TransactionDetailRow :item="item" />
    </div>
  </div>
</template>

<script lang="ts">
// external dependencies
import { Component, Prop, Vue } from 'vue-property-decorator'
import { TransferTransaction, NamespaceId, Address, Message } from 'symbol-sdk'

// internal dependencies
import { ViewTransferTransaction } from '@/core/transactions/ViewTransferTransaction'
import { AttachedMosaic } from '@/services/MosaicService'

// child components
import TransactionDetailRow from '@/components/TransactionDetails/TransactionDetailRow/TransactionDetailRow.vue'
import {TransactionDetailItem} from '@/components/TransactionDetails/TransactionDetailRow/TransactionDetailItem'

@Component({ components: { TransactionDetailRow } })
export default class Transfer extends Vue {
  @Prop({ default: null }) view: ViewTransferTransaction

  /**
   * Displayed sender
   * @var {string}
   */
  private get sender(): string {
    if (this.view.transaction.signer) return this.view.transaction.signer.address.pretty()
    const currentSignerAddress = this.$store.getters['wallet/currentSignerAddress']
    return currentSignerAddress ? currentSignerAddress.pretty() : ''
  }

  /**
   * Displayed recipient
   * @var {string}
   */
  private get recipient(): Address | NamespaceId {
    return (this.view.transaction as TransferTransaction).recipientAddress
  }

  /**
   * Displayed items
   * @type {({ key: string, value: string | boolean, isMosaic: boolean }[])}
   */
  protected get items(): TransactionDetailItem[] {
    const attachedMosaics: AttachedMosaic[] = this.view.values.get('mosaics')
    const message: Message = this.view.values.get('message')
    const incoming = this.view.values.get('isIncoming')
    const mosaicItems = attachedMosaics.map((mosaic, index, self) => {
      const color = (incoming ? 'green' : 'red')
      return {
        key: `${this.$t('mosaic')} (${index + 1}/${self.length})`,
        value: {...mosaic, color},
        isMosaic: true,
      }
    })

    return [
      { key: 'sender', value: this.sender },
      { key: 'transfer_target', value: this.recipient, isAddress:true },
      ...mosaicItems,
      { key: 'message', value: message.payload || '-' },
    ]
  }
}
</script>

<style lang="less" scoped>
@import "../TransactionDetails.less";
</style>
