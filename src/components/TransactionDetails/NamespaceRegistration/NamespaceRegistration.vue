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
import { UInt64, NamespaceRegistrationType } from 'symbol-sdk'
import {mapGetters} from 'vuex'
// internal dependencies
import { TransactionViewType } from '@/services/TransactionService'
import {NetworkConfigurationModel} from '@/core/database/entities/NetworkConfigurationModel'
// child components
import TransactionDetailRow from '@/components/TransactionDetails/TransactionDetailRow/TransactionDetailRow.vue'
import {TransactionDetailItem} from '@/components/TransactionDetails/TransactionDetailRow/TransactionDetailItem'

import { TimeHelpers } from '@/core/utils/TimeHelpers' 
@Component({
  components: { TransactionDetailRow } ,
  computed: {
    ...mapGetters({
      networkConfiguration: 'network/networkConfiguration',
    }),
  },
})
export default class NamespaceRegistration extends Vue {
  @Prop({ default: null }) view: TransactionViewType

  private networkConfiguration: NetworkConfigurationModel
  /**
   * Displayed items
   * @see {Store.Mosaic}
   * @type {({ key: string, value: string | boolean }[])}
   */
  get items(): TransactionDetailItem[] {
    const rootNamespaceName: string = this.view.values.get('rootNamespaceName')
    const subNamespaceName: string = this.view.values.get('subNamespaceName')
    const registrationType: NamespaceRegistrationType = this.view.values.get(
      'registrationType',
    )
    const duration: UInt64 = this.view.values.get('duration')
    const blockGenerationTargetTime = this.networkConfiguration.blockGenerationTargetTime
    if (registrationType === NamespaceRegistrationType.RootNamespace) {
      return [
        { key: 'namespace_name', value: rootNamespaceName },
        {
          key: 'duration',
          value: TimeHelpers.durationToRelativeTime(parseInt(duration.toString()),blockGenerationTargetTime),
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

