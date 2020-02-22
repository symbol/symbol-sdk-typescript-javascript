<template>
  <div class="transaction-details-item-inner-container">
    <div
      v-for="({ key, value, isMosaic }, index) in items"
      :key="index"
      class="transaction-row-outer-container"
    >
      <TransactionDetailRow :label="key" :value="value" :is-mosaic="isMosaic" />
    </div>
  </div>
</template>

<script lang="ts">
// external dependencies
import { Component, Prop, Vue } from 'vue-property-decorator'
import {
  MosaicId,
  TransferTransaction,
  NamespaceId,
  Address,
  Message,
} from 'nem2-sdk'

// internal dependencies
import { TransactionViewType } from '@/services/TransactionService'

// child components
import TransactionDetailRow from '@/components/TransactionDetails/TransactionDetailRow/TransactionDetailRow.vue'

@Component({ components: { TransactionDetailRow } })
export default class Transfer extends Vue {
  @Prop({ default: null }) view: TransactionViewType

  /**
   * Displayed recipient
   * @var {string}
   */
  private get recipient(): string {
    const recipient = (this.view.transaction as TransferTransaction)
      .recipientAddress
    if (recipient instanceof NamespaceId) {
      const name = (recipient as NamespaceId).fullName
      return name.length ? name : (recipient as NamespaceId).toHex()
    }

    return (recipient as Address).pretty()
  }

  /**
   * Displayed items
   * @type {({ key: string, value: string | boolean, isMosaic: boolean }[])}
   */
  protected get items(): { key: string, value: any, isMosaic?: boolean }[] {
    const attachedMosaics: {
      id: MosaicId
      mosaicHex: string
      amount: number
    }[] = this.view.values.get('mosaics')
    const message: Message = this.view.values.get('message')

    const mosaicItems = attachedMosaics.map((mosaic, index, self) => ({
      key: `${this.$t('mosaic')} (${index + 1}/${self.length})`,
      value: mosaic,
      isMosaic: true,
    }))

    return [ ...mosaicItems, { key: 'message', value: message.payload || '-' }]
  }
}
</script>

<style lang="less" scoped>
@import "../TransactionDetails.less";
</style>
