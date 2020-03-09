<template>
  <div class="transaction-table-container">
    <TransactionListHeader />
    <div v-if="transactions.length" class="transaction-rows-outer-container">
      <div v-if="transactions.length" class="transaction-rows-inner-container">
        <TransactionRow
          v-for="(transaction, index) in transactionsList"
          :key="transaction.transactionInfo.hash"
          :transaction="transaction"
          @click="$emit('click', transaction)"
        />
      </div>
    </div>

    <div v-if="!transactions.length" class="no-data-container">
      <div v-for="item in nodata" :key="item"></div>
    </div>
  </div>
</template>

<script lang="ts">
// external dependenies
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Transaction } from 'symbol-sdk'

// child components
import TransactionRow from '@/components/TransactionList/TransactionRow/TransactionRow.vue'
import TransactionListHeader from '@/components/TransactionList/TransactionListHeader/TransactionListHeader.vue'

@Component({
  components: {
    TransactionRow,
    TransactionListHeader,
  },
})
export default class TransactionTable extends Vue {
  @Prop({ default: [] }) transactions: Transaction[]
  @Prop({ default: 'no_data'}) emptyMessage: string
  public nodata = [1,2,3,4,5,6];

  get transactionsList(): Transaction[] {
    return this.transactions
  }
}
</script>

<style lang="less">
@import "./TransactionTable.less";
</style>
