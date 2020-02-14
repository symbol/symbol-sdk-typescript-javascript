<template>
  <AssetFormPageWrap>
    <template v-slot:form-section>
      <FormMosaicDefinitionTransaction />
    </template>
    <template v-slot:form-description>
      <div class="asset-description-title">
        {{ $t('mosaic') }}
      </div>
      <div class="asset-description-sub-title">
        {{ $t('supply') }}
      </div>
      <div class="asset-description-emphasis">
        {{ $t('mosaic_describe_text') }}
      </div>
      <div class="asset-description-emphasis">
        {{ $t('divisibility_can_not_less_than_0') }}
      </div>
      <div class="asset-description-emphasis">
        {{ $t('divisibility_can_not_more_than_6') }}
      </div>
      <div class="asset-description-sub-title">
        {{ $t('divisibility') }}
      </div>
      <div class="asset-description-emphasis">
        {{ $t('supply_can_not_less_than_0') }}
      </div>
    </template>
  </AssetFormPageWrap>
</template>

<script lang="ts">
// external dependencies
import {Component, Vue} from 'vue-property-decorator'

// child components
import AssetFormPageWrap from '@/views/pages/assets/AssetFormPageWrap/AssetFormPageWrap.vue'
import FormMosaicDefinitionTransaction from '@/views/forms/FormMosaicDefinitionTransaction/FormMosaicDefinitionTransaction.vue'

// @ts-ignore
@Component({ components: {AssetFormPageWrap, FormMosaicDefinitionTransaction} })
export default class CreateMosaicPage extends Vue {}
</script>
