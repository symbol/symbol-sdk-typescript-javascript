<template>
  <AssetFormPageWrap>
    <template v-slot:form-section>
      <FormNamespaceRegistrationTransaction
        :namespace-registration-type="NamespaceRegistrationType.SubNamespace"
      />
    </template>
    <template v-slot:form-description>
      <div class="asset-description-title">
        {{ $t('sub_namespace') }}
      </div>
      <div class="asset-description-sub-title">
        {{ $t('namespace_name') }}
      </div>
      <div class="asset-description-text">
        {{ $t('namespace_tips_key_1') }}
      </div>
      <div class="asset-description-emphasis">
        {{ $t('namespace_tips_value_1') }}
      </div>
      <div class="asset-description-text">
        {{ $t('namespace_tips_key_2') }}
      </div>
      <div class="asset-description-emphasis">
        {{ $t('namespace_tips_value_2') }}
      </div>
      <div class="asset-description-text">
        {{ $t('namespace_tips_key_3') }}
      </div>
    </template>
  </AssetFormPageWrap>
</template>

<script lang="ts">
// external dependencies
import {Component, Vue} from 'vue-property-decorator'
import {NamespaceRegistrationType} from 'nem2-sdk'

// child components
import AssetFormPageWrap from '@/components/AssetFormPageWrap/AssetFormPageWrap.vue'
import FormNamespaceRegistrationTransaction from '@/views/forms/FormNamespaceRegistrationTransaction/FormNamespaceRegistrationTransaction.vue'

// @ts-ignore
@Component({
  components: {AssetFormPageWrap, FormNamespaceRegistrationTransaction},
  data() {return {NamespaceRegistrationType}},
})
export default class CreateSubNamespacePage extends Vue {}
</script>
