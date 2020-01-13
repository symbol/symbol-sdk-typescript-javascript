<template>
  <div class="multisig_form_container">
    <div class="radius">
      <DisabledForms />
      <div class="transaction-wrapper radius">
        <TransactionList :mode="TransactionCategories.TO_COSIGN" />
      </div>
    </div>
    <div class="right_multisig_info radius scroll">
      <MultisigTree />
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import {TransactionCategories} from '@/core/model'
import TransactionList from '@/components/transaction-list/TransactionList.vue'
import MultisigTree from '@/views/multisig/multisig-tree/MultisigTree.vue'
import ErrorTooltip from '@/components/other/forms/errorTooltip/ErrorTooltip.vue'
import DisabledForms from '@/components/disabled-forms/DisabledForms.vue'

@Component({
  components: {TransactionList, MultisigTree, ErrorTooltip, DisabledForms},
})
export default class MultisigCosign extends Vue {
  TransactionCategories = TransactionCategories
}

</script>
<style scoped lang="less">
@import "MultisigCosign.less";
</style>
