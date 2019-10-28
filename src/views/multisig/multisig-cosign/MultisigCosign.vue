<template>
  <div>
    <div>
      publicKey
      <input v-model="publicKey" type="text">
      <div @click="getCosignTransactions" style="width: 60px;height: 30px ; background-color: #4DC2BF">search</div>
    </div>
    <div>
      <TransactionList :mode="TRANSACTIONS_CATEGORIES.TO_COSIGN" />
    </div>
  </div>  
</template>

<script lang="ts">
    import {MultisigCosignTs} from './MultisigCosignTs'
    export default class MultisigCosign extends MultisigCosignTs {}
</script>
<style scoped lang="less">
  @import "MultisigCosign.less";
</style>
