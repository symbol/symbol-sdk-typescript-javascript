<template>
  <div class="table_head">
    <div class="col2-header"><span>{{ $t('from_to_action') }}</span></div>
    <div class="col3-header"><span>{{ $t('amount_asset') }}</span></div>
    <div class="col4-header"><span>{{ $t('confirmations_height') }}</span></div>
    <div class="col5-header"><span>{{ $t('hash_date') }}</span></div>
  </div>
</template>

<script>
import {Component, Vue, Prop} from 'vue-property-decorator'

@Component
export default class TransactionListHeader extends Vue {}
</script>
