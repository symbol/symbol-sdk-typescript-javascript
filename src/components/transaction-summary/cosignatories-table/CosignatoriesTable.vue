<template>
  <div class="table_container radius">
    <div class="table_head column_item">
      <span class="data_item index">{{ $t('action') }}</span>
      <span class="data_item name">{{ $t('cosignatory') }}</span>
    </div>

    <div
      v-if="modifications.length"
      class="table_body scroll flex-direction-column"
    >
      <div
        v-for="({addOrRemove, cosignatory}, index) in modifications"
        :key="index"
        class="modification-row"
      >
        <span class="data_item overflow_ellipsis index">{{ $t(`${addOrRemove}`) }}</span>
        <span
          class="index data_item overflow_ellipsis name"
        >{{ cosignatory.address.pretty() }}</span>
      </div>
    </div>

    <div v-else class="no-data">
      {{$t('no_data')}}
    </div>

  </div>
</template>

<script lang="ts">
import { mapState } from "vuex";
import { Component, Prop, Vue } from "vue-property-decorator";
import { CosignatoryModification } from "@/core/model";

@Component
export default class CosignatoriesTable extends Vue {
  @Prop() modifications: CosignatoryModification[];
}
</script>
<style scoped lang="less">
@import "CosignatoriesTable.less";
</style>
