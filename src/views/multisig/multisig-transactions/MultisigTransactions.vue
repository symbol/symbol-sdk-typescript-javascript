<template>
  <div class="multisig_transactions">
    <MultisigConversion v-if="!hasCosignatories"/>
    <!-- <MultisigModification v-if="hasCosignatories" /> -->
    <div class="not_ready" v-else>{{$t('Mutlisig_account_modification_transaction_form_is_not_ready_yet')}}</div>
  </div>
</template>

<script lang="ts">
    import {MultisigTransactionsTs} from './MultisigTransactionsTs'

    export default class MultisigManagement extends MultisigTransactionsTs {
    }
</script>
<style scoped lang="less">
  @import "./MultisigTransactions.less";
</style>

