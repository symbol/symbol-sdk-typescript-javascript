<template>
  <AssetListPageWrap>
    <template v-slot:table-title>
      {{ $t('Namespace_and_Sub_Namespace') }}
    </template>
    <template v-slot:table-description>
      {{ $t('Under_the_current_wallet') }}
    </template>
    <template v-slot:table-section>
      NAMESPACE TABLE HERE
    </template>
    <template v-slot:asset-description>
      <div class="asset-description-title">
        {{ $t('namespace') }}
      </div>
      <div class="asset-description-sub-title">
        {{ $t('define') }}
      </div>
      <div class="asset-description-emphasis">
        {{ $t('A_namespace_starts_with_a_name_that_you_choose_similar_to_an_internet_domain_name') }}
      </div>
      <div class="asset-description-sub-title">
        {{ $t('Namespace_description') }}
      </div>
      <div class="asset-description-emphasis">
        {{ $t('The_name_must_appear_as_unique_in_the_network_and_may_have_a_maximum_length_of_64_characters') }}
      </div>
      <div>{{ $t('asset-description-text') }}</div>
      <div class="asset-description-sub-title">
        {{ $t('scenes_to_be_used') }}
      </div>
      <div class="asset-description-text">
        {{ $t('Used_to_bind_a_wallet_address') }}
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
export default class NamespaceListPage extends Vue {}
</script>
