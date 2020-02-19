<template>
  <AssetListPageWrap>
    <template v-slot:table-section>
      <TableDisplay asset-type="mosaic" class="table-section">
        <template v-slot:table-title>
          <h1 class="section-title">
            {{ $t('Mosaics') }}
          </h1>
        </template>
      </TableDisplay>
    </template>
    <template v-slot:asset-description>
      <div class="asset-description-title">
        {{ $t('mosaic_assets') }}
      </div>
      <div class="asset-description-sub-title"> 
        {{ $t('describe') }}
      </div>
      <div class="asset-description-emphasis">
        {{ $t('mosaic_describe_text') }}
      </div>
      <div class="asset-description-sub-title">
        {{ $t('attribute') }}
      </div>
      <div class="asset-description-emphasis">
        {{ $t('mosaic_attribute_text') }}
      </div>
      <div class="asset-description-sub-title">
        {{ $t('mosaic_attribute_text_2') }}
      </div>
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
  padding: 0.2rem;
  height: 100%;
}
</style>
