<template>
  <AssetListPageWrap>
    <template v-slot:table-section>
      <TableDisplay asset-type="mosaic" class="table-section">
        <template v-slot:table-title>
          <h1 class="section-title">
            {{ $t('mosaics_list') }}
          </h1>
        </template>
      </TableDisplay>
    </template>
  </AssetListPageWrap>
</template>

<script lang="ts">
// external dependencies
import { Component, Vue } from 'vue-property-decorator'

// child components
import AssetListPageWrap from '@/views/pages/assets/AssetListPageWrap/AssetListPageWrap.vue'
import TableDisplay from '@/components/TableDisplay/TableDisplay.vue'

@Component({
  components: {
    AssetListPageWrap,
    TableDisplay,
  },
})
export default class MosaicListPage extends Vue { }
</script>

<style scoped lang="css">
.table-section {
  padding: 0.2rem 0 0 0.2rem;
  height: 100%;
}
</style>
