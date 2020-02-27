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
import {Component, Prop, Vue} from 'vue-property-decorator'

// internal dependencies
import { ViewHashLockTransaction } from '../../../core/transactions/ViewHashLockTransaction'
import { AttachedMosaic } from '@/services/MosaicService'

// child components
import TransactionDetailRow from '@/components/TransactionDetails/TransactionDetailRow/TransactionDetailRow.vue'

@Component({ components: { TransactionDetailRow } })
export default class HashLock extends Vue {
  @Prop({ default: null }) view: ViewHashLockTransaction

  /**
   * Displayed items
   * @type {({ key: string, value: string | boolean, isMosaic: boolean }[])}
   */
  protected get items(): { key: string, value: any, isMosaic?: boolean }[] {
    // get attached mosaic
    const attachedMosaic: AttachedMosaic = this.view.values.get('mosaic')

    return [
      { key: `${this.$t('locked_mosaic')}`, value: attachedMosaic, isMosaic: true },
      { key: 'duration', value: this.view.values.get('duration') },
      { key: 'inner_transaction_hash', value: this.view.values.get('signedTransaction').hash },
    ]
  }
}
</script>

<style lang="less" scoped>
@import '../TransactionDetails.less';
</style>
