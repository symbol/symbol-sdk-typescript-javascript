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

<style scoped lang="less">
.table_head {
  padding: 2px 0 10px;

  .col2-header {
    float: left;
    position: relative;
    width: 509px;
    padding-left: 70px;
  }

  .col3-header {
    float: left;
    position: relative;
    width: 158px;
    padding-left: 30px;
    overflow: hidden;
  }

  .col4-header {
    float: left;
    position: relative;
    text-align: right;
    width: 140px;
  }

  .col5-header {
    float: left;
    position: relative;
    width: 270px;
    padding-right: 55px;
    text-align: right;
  }

  span {
    font-size: 16px;
    color: #999999;
  }

  .account {
    padding-left: 70px;
  }
}
</style>
