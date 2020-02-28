
<template>
  <MultisigFormPage>
    <template v-slot:form-section>
      <FormMultisigAccountModificationTransaction />
    </template>
    <!-- <template v-slot:right-section>
      ManageAccountPage right section
    </template>  -->
  </MultisigFormPage>
</template>

<script>
// external dependencies
import {Component, Vue} from 'vue-property-decorator'

// child components
import MultisigFormPage from '@/views/pages/multisig/MultisigFormPage/MultisigFormPage.vue'
import FormMultisigAccountModificationTransaction from '@/views/forms/FormMultisigAccountModificationTransaction/FormMultisigAccountModificationTransaction.vue'

@Component({ components: {
  MultisigFormPage,
  FormMultisigAccountModificationTransaction,
}})
export default class ManageAccountPage extends Vue {}
</script>
