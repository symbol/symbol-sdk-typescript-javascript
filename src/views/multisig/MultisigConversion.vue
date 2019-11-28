<template>
    <MultisigAccountModification :mode="MULTISIG_FORM_MODES.CONVERSION" />
</template>

<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator'
    import MultisigAccountModification from '@/components/forms/multisig-account-modification/MultisigAccountModification.vue'
    import {MULTISIG_FORM_MODES} from '@/core/model'
    @Component({
      components: { MultisigAccountModification },
      data() { return { MULTISIG_FORM_MODES }},
    })
    export default class MultisigModification extends Vue {}
</script>
