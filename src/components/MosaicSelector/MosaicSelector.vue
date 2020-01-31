<template>
  <ErrorTooltip field-name="selectedMosaic">
    <AutoComplete
      v-model="selectedMosaic"
      v-validate="'required|namespaceOrMosaicId'"
      v-focus
      :placeholder="$t('Please_enter_mosaic_hex_or_alias')"
      class="asset_type"
      :data-vv-as="$t('asset_type')"
      data-vv-name="selectedMosaic"
    >
      <Option 
          v-for="m in mosaics"
          :key="m.id.toHex()"
          :value="m.id.toHex()">
        {{ mosaicsNames.hasOwnProperty(m.id.toHex()) ? mosaicsNames[m.id.toHex()] : m.id.toHex() }}
      </Option>
    </AutoComplete>
  </ErrorTooltip>
</template>

<script lang="ts">
import {MosaicSelectorTs} from './MosaicSelectorTs'

export default class MosaicSelector extends MosaicSelectorTs {}
</script>
