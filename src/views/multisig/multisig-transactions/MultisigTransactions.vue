<template>
  <div>
    <MultisigConversion v-if="!hasCosignatories" />
    <!-- <MultisigModification v-if="hasCosignatories" /> -->
    <div v-if="hasCosignatories" >Mutlisig account modification transaction form is not ready yet!</div>
  </div>
</template>

<script lang="ts">
    import {MultisigTransactionsTs} from './MultisigTransactionsTs'
    export default class MultisigManagement extends MultisigTransactionsTs {}
</script>
