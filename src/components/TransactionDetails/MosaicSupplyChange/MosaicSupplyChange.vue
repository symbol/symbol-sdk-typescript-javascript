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
import { MosaicSupplyChangeAction, MosaicId, UInt64 } from 'symbol-sdk'

// internal dependencies
import { TransactionViewType } from '@/services/TransactionService'

// child components
import TransactionDetailRow from '@/components/TransactionDetails/TransactionDetailRow/TransactionDetailRow.vue'

@Component({ components: { TransactionDetailRow } })
export default class MosaicSupplyChange extends Vue {
  @Prop({ default: null }) view: TransactionViewType

  /**
   * Displayed items
   * @see {Store.Mosaic}
   * @type {({ key: string, value: string | boolean }[])}
   */
  get items(): { key: string, value: string | boolean }[] {
    const mosaicId: MosaicId = this.view.values.get('mosaicId')
    const action: MosaicSupplyChangeAction = this.view.values.get('action')
    const delta: UInt64 = this.view.values.get('delta')

    return [
      { key: 'mosaicId', value: mosaicId.toHex() },
      {
        key: 'direction',
        value: `${this.$t(
          action === MosaicSupplyChangeAction.Increase ? 'Increase' : 'Decrease',
        )}`,
      },
      {
        key: 'delta',
        value: delta.compact().toLocaleString(),
      },
    ]
  }
}
</script>

<style lang="less" scoped>
@import "../TransactionDetails.less";
</style>


