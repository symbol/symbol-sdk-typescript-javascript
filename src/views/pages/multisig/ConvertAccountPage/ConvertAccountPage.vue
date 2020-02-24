
<template>
  <MultisigFormPage>
    <template v-slot:form-section>
      <FormMultisigAccountModificationTransaction multisig-operation-type="conversion" />
    </template>
    <!-- <template v-slot:right-section>
      ConvertAccountPage right section
    </template> -->
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
export default class ConvertAccountPage extends Vue {}
</script>
