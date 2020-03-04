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
import { UInt64, NamespaceRegistrationType } from 'symbol-sdk'

// internal dependencies
import { TransactionViewType } from '@/services/TransactionService'

// child components
import TransactionDetailRow from '@/components/TransactionDetails/TransactionDetailRow/TransactionDetailRow.vue'

@Component({ components: { TransactionDetailRow } })
export default class NamespaceRegistration extends Vue {
  @Prop({ default: null }) view: TransactionViewType

  /**
   * Displayed items
   * @see {Store.Mosaic}
   * @type {({ key: string, value: string | boolean }[])}
   */
  get items(): { key: string, value: string | boolean }[] {
    const rootNamespaceName: string = this.view.values.get('rootNamespaceName')
    const subNamespaceName: string = this.view.values.get('subNamespaceName')
    const registrationType: NamespaceRegistrationType = this.view.values.get(
      'registrationType',
    )
    const duration: UInt64 = this.view.values.get('duration')

    if (registrationType === NamespaceRegistrationType.RootNamespace) {
      return [
        { key: 'namespace_name', value: rootNamespaceName },
        {
          key: 'duration',
          value: duration.compact().toLocaleString(),
        },
      ]
    }

    return [
      { key: 'namespace_name', value: subNamespaceName },
      {
        key: 'parent_namespace',
        value: rootNamespaceName,
      },
    ]
  }
}
</script>

<style lang="less" scoped>
@import "../TransactionDetails.less";
</style>

