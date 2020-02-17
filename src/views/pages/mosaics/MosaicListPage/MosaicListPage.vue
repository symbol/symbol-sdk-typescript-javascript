<template>
  <div style="height: 100%">
    <AssetListPageWrap>
      <template v-slot:table-section>
        <TableDisplay asset-type="mosaic" class="table-section" @show-alias-form="showAliasForm">
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
    <ModalFormWrap v-if="hasAliasForm" :visible="hasAliasForm" @close="hasAliasForm = false">
      <template v-slot:form>
        <FormAliasTransaction
          :namespace-id="namespaceId"
          :alias-target="aliasTarget"
          :alias-action="aliasAction"
        />
      </template>
    </ModalFormWrap>
  </div>
</template>

<script lang="ts">
// external dependencies
import { Component, Vue } from 'vue-property-decorator'
import { NamespaceId, MosaicId, Address, AliasAction } from 'nem2-sdk'

// child components
import AssetListPageWrap from '@/views/pages/assets/AssetListPageWrap/AssetListPageWrap.vue'
import TableDisplay from '@/components/TableDisplay/TableDisplay.vue'
import ModalFormWrap from '@/views/modals/ModalFormWrap/ModalFormWrap.vue'
import FormAliasTransaction from '@/views/forms/FormAliasTransaction/FormAliasTransaction.vue'

@Component({
  components: {
    AssetListPageWrap,
    TableDisplay,
    ModalFormWrap,
    FormAliasTransaction,
  },
})
export default class MosaicListPage extends Vue {
  /**
   * Alias form visibility state
   * @type {boolean}
   * @protected
   */
  protected hasAliasForm: boolean = false

  // Alias forms props
  protected namespaceId: NamespaceId = null
  protected aliasTarget: MosaicId | Address = null
  protected aliasAction: AliasAction = null

  /**
   * Sets Alias form props and shows it
   * @protected
   * @return {void}
   */
  protected showAliasForm(args: {
    namespaceId: NamespaceId
    aliasTarget: MosaicId | Address
    aliasAction: AliasAction
  }): void {
    console.log('TCL: MosaicListPage -> args', args)
    this.namespaceId = args.namespaceId
    this.aliasTarget = args.aliasTarget
    this.aliasAction = args.aliasAction
    this.hasAliasForm = true
  }
}
</script>

<style scoped lang="css">
.table-section {
  padding: 0.2rem;
  height: 100%;
}
</style>
