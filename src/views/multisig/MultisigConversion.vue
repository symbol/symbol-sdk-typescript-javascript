<template>
    <MultisigTransactionForm :mode="MULTISIG_FORM_MODES.CONVERSION" />
</template>

<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator'
    import MultisigTransactionForm from './multisig-transaction-form/MultisigTransactionForm.vue'
    import {MULTISIG_FORM_MODES} from '@/core/model'
    @Component({
      components: { MultisigTransactionForm },
      data() { return { MULTISIG_FORM_MODES }},
    })
    export default class MultisigModification extends Vue {}
</script>
