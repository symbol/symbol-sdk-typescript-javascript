<template>
  <AssetListPageWrap>
    <template v-slot:table-section>
      <TableDisplay asset-type="namespace" class="table-section">
        <template v-slot:table-title>
          <h1 class="section-title">
            {{ $t('Namespace_and_Sub_Namespace') }}
          </h1>
        </template>
      </TableDisplay>
    </template>
    <template v-slot:asset-description>
      <div class="asset-description-title">
        {{ $t('namespace') }}
      </div>
      <div class="asset-description-sub-title">
        {{ $t('define') }}
      </div>
      <div
        class="asset-description-emphasis"
      >
        {{ $t('A_namespace_starts_with_a_name_that_you_choose_similar_to_an_internet_domain_name') }}
      </div>
      <div class="asset-description-sub-title">
        {{ $t('Namespace_description') }}
      </div>
      <div
        class="asset-description-emphasis"
      >
        {{ $t('The_name_must_appear_as_unique_in_the_network_and_may_have_a_maximum_length_of_64_characters') }}
      </div>
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
export default class NamespaceListPage extends Vue { }
</script>

<style scoped lang="css">
.table-section {
  padding: 0.2rem 0 0 0.2rem;
  height: 100%;
}
</style>
