<template>
  <AssetListPageWrap>
    <template v-slot:table-title>
      {{ $t('Namespace_and_Sub_Namespace') }}
    </template>
    <template v-slot:table-description>
      {{ $t('Under_the_current_wallet') }}
    </template>
    <template v-slot:table-section>
      MOSAIC TABLE HERE
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
import {Component, Vue} from 'vue-property-decorator'

// child components
import AssetListPageWrap from '@/components/AssetListPageWrap/AssetListPageWrap.vue'

@Component({ components: {AssetListPageWrap} })
export default class MosaicListPage extends Vue {}
</script>
