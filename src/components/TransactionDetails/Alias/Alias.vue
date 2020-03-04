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
import {Component, Prop, Vue} from 'vue-property-decorator'
import {MosaicId, Address, NamespaceId, AliasAction } from 'symbol-sdk'

// internal dependencies
import {TransactionViewType} from '@/services/TransactionService'
import {NamespaceService} from '@/services/NamespaceService'

// child components
import TransactionDetailRow from '@/components/TransactionDetails/TransactionDetailRow/TransactionDetailRow.vue'

@Component({ components: { TransactionDetailRow } })
export default class Alias extends Vue {
  @Prop({ default: null }) view: TransactionViewType


  /**
   * Displayed items
   * @type {({ key: string, value: string | boolean }[])}
   */
  protected get items(): { key: string, value: string | boolean }[] {
    const namespaceId: NamespaceId = this.view.values.get('namespaceId')
    const aliasTarget: Address | MosaicId = this.view.values.get('aliasTarget')
    const aliasAction: AliasAction = this.view.values.get('aliasAction')

    const targetKey = aliasTarget instanceof Address ? 'address' : 'mosaic'
    const targetValue = aliasTarget instanceof Address ? aliasTarget.pretty() : aliasTarget.toHex()

    return [
      { key: 'namespace', value: this.getNamespace(namespaceId)},
      { key: 'action', value: aliasAction === AliasAction.Link ? 'Link' : 'Unlink' },
      { key: targetKey, value: targetValue },
    ]
  }

  /**
   * Prepares a view of the namespaces with its name if available
   * @param {MosaicId} mosaicId 
   * @return {NamespacesModel}
   */
  private getNamespace(namespaceId: NamespaceId): string {
    // Try to get namespace from database
    const model = new NamespaceService().getNamespaceSync(namespaceId)

    // Default to hex Id
    if (!model || !model.values.get('name')) return namespaceId.toHex()

    // Return name and hex Id
    return `${model.values.get('name')} (${namespaceId.toHex()})`
  }
}
</script>

<style lang="less" scoped>
@import '../TransactionDetails.less';
</style>
