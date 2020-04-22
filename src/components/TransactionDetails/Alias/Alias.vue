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
import {Component, Prop, Vue} from 'vue-property-decorator'
import {Address, AliasAction, MosaicId, NamespaceId} from 'symbol-sdk'
import {TransactionViewType} from '@/services/TransactionService'
import TransactionDetailRow from '@/components/TransactionDetails/TransactionDetailRow/TransactionDetailRow.vue'
import {TransactionDetailItem} from '@/components/TransactionDetails/TransactionDetailRow/TransactionDetailItem'

@Component({ components: { TransactionDetailRow } })
export default class Alias extends Vue {
  @Prop({ default: null }) view: TransactionViewType


  /**
   * Displayed items
   * @type {({ key: string, value: string | boolean }[])}
   */
  protected get items(): TransactionDetailItem[] {
    const namespaceId: NamespaceId = this.view.values.get('namespaceId')
    const name: string = this.view.values.get('name')
    const aliasTarget: Address | MosaicId = this.view.values.get('aliasTarget')
    const aliasAction: AliasAction = this.view.values.get('aliasAction')

    const targetKey = aliasTarget instanceof Address ? 'address' : 'mosaic'
    const targetValue = aliasTarget instanceof Address ? aliasTarget.pretty() : aliasTarget.toHex()

    return [
      { key: 'namespace', value: name || namespaceId.toHex()},
      { key: 'action', value: aliasAction === AliasAction.Link ? 'Link' : 'Unlink' },
      { key: targetKey, value: targetValue },
    ]
  }
}
</script>

<style lang="less" scoped>
@import '../TransactionDetails.less';
</style>
