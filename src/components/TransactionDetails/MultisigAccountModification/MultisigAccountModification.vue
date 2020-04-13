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
// extenrnal dependencies
import {PublicAccount, NetworkType, Address} from 'symbol-sdk'
import {mapGetters} from 'vuex'
import {Component, Prop, Vue} from 'vue-property-decorator'

// internal dependencies
import {TransactionViewType} from '@/services/TransactionService'

// child components
import TransactionDetailRow from '@/components/TransactionDetails/TransactionDetailRow/TransactionDetailRow.vue'

@Component({
  components: { TransactionDetailRow },
  computed: {...mapGetters({ networkType: 'network/networkType' })},
})
export default class MultisigAccountModification extends Vue {
  @Prop({ default: null }) view: TransactionViewType

  /**
   * Current network type
   * @type {NetworkType}
   */
  private networkType: NetworkType

  protected get items(): { key: string, value: string | boolean }[] {
    // get data from view values
    const minApprovalDelta: number = this.view.values.get('minApprovalDelta')
    const minRemovalDelta: number = this.view.values.get('minRemovalDelta')
    const publicKeyAdditions: PublicAccount[] = this.view.values.get('publicKeyAdditions')
    const publicKeyDeletions: PublicAccount[] = this.view.values.get('publicKeyDeletions')

    // push approval and removal deltas to view items
    const items = [
      { key: 'minApprovalDelta', value: `${minApprovalDelta}`},
      { key: 'minRemovalDelta', value: `${minRemovalDelta}`},
    ]

    // render views for public key additions and deletions
    const additions = publicKeyAdditions.map(({publicKey}, index, self) => {
      return {
        key: `${this.$t('public_key_addition')} (${index + 1}/${self.length})`,
        value: Address.createFromPublicKey(publicKey, this.networkType).pretty(),
      }
    })

    const deletions = publicKeyDeletions.map(({publicKey}, index, self) => {
      return {
        key: `${this.$t('public_key_deletion')} (${index + 1}/${self.length})`,
        value: Address.createFromPublicKey(publicKey, this.networkType).pretty(),
      }
    })

    // push rendered public key additions and deletions to the view items
    if (additions.length) items.push(...additions)
    if (deletions.length) items.push(...deletions)

    return items
  }
}
</script>

<style lang="less" scoped>
@import '../TransactionDetails.less';
</style>
