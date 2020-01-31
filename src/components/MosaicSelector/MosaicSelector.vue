<template>
  <div class="asset">
    <ErrorTooltip field-name="selectedMosaic">
      <AutoComplete
        v-model="selectedMosaicName"
        v-validate="'required|namespaceOrMosaicId'"
        v-focus
        class="type"
        :placeholder="$t('Please_enter_mosaic_hex_or_alias')"
        :data-vv-as="$t('asset_type')"
        data-vv-name="selectedMosaic"
      >
        <Option 
            v-for="m in mosaics"
            v-bind:key="m.id.toHex()"
            v-bind:value="getMosaicName(m.id)">
          {{ getMosaicName(m.id) }}
        </Option>
      </AutoComplete>
    </ErrorTooltip>
  </div>
</template>

<script lang="ts">
import {MosaicSelectorTs} from './MosaicSelectorTs'
import './MosaicSelector.less'

export default class MosaicSelector extends MosaicSelectorTs {}
</script>
