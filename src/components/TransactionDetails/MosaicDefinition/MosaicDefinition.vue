<template>
  <div class="transaction-details-item-inner-container">
    <div
      v-for="({ key, value }, index) in items"
      :key="index"
      class="transaction-row-outer-container"
    >
      <TransactionDetailRow :label="key" :value="value" />
    </div>
  </div>
</template>

<script lang="ts">
// external dependencies
import { Component, Prop, Vue } from 'vue-property-decorator'
import { MosaicFlags, MosaicId } from 'symbol-sdk'

// internal dependencies
import { TransactionViewType } from '@/services/TransactionService'

// child components
import TransactionDetailRow from '@/components/TransactionDetails/TransactionDetailRow/TransactionDetailRow.vue'

@Component({ components: { TransactionDetailRow } })
export default class MosaicDefinition extends Vue {
  @Prop({ default: null }) view: TransactionViewType

  /**
   * Displayed items
   * @type {({ key: string, value: string | boolean }[])}
   */
  get items(): { key: string, value: string | boolean }[] {
    const mosaicId: MosaicId = this.view.values.get('mosaicId')
    const divisibility: number = this.view.values.get('divisibility')
    const mosaicFlags: MosaicFlags = this.view.values.get('mosaicFlags')

    return [
      { key: 'mosaicId', value: mosaicId.toHex() },
      {
        key: 'table_header_divisibility',
        value: `${divisibility}`,
      },
      {
        key: 'table_header_transferable',
        value: mosaicFlags.transferable,
      },
      {
        key: 'table_header_supply_mutable',
        value: mosaicFlags.supplyMutable,
      },
      {
        key: 'table_header_restrictable',
        value: mosaicFlags.restrictable,
      },
    ]
  }
}
</script>

<style lang="less" scoped>
@import "../TransactionDetails.less";
</style>
