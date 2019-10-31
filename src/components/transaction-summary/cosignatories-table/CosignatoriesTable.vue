<template>
  <div class="table_container radius">
    <div class="table_head column_item">
      <span class="data_item index">{{ $t('action') }}</span>
      <span class="data_item name">{{ $t('cosignatory') }}</span>
    </div>

    <div class=" table_body scroll">
      <div
        v-for="(co, index) in cosignatories"
        :key="index"
      >
        <span class="data_item overflow_ellipsis index">
          {{co.modificationType === CosignatoryModificationAction.Add ? $t('Remove') : $t('Add') }}
        </span>
        <span class="index data_item overflow_ellipsis name">
          {{co.cosignatoryPublicAccount.publicKey}}
        </span>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator'
    import { MultisigCosignatoryModification, CosignatoryModificationAction } from 'nem2-sdk'
    
    @Component
    export default class CosignatoriesTable extends Vue {
      CosignatoryModificationAction = CosignatoryModificationAction
      
      @Prop({ default: []}) cosignatories: MultisigCosignatoryModification[]
    }
</script>
<style scoped lang="less">
  @import "CosignatoriesTable.less";
</style>
