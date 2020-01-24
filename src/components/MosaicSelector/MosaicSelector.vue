<template>
  <ErrorTooltip field-name="selectedMosaic">
    <AutoComplete
      v-model="value"
      v-validate="'required|namespaceOrMosaicId'"
      v-focus
      :placeholder="$t('Please_enter_mosaic_hex_or_alias')"
      class="asset_type"
      :data-vv-as="$t('asset_type')"
      data-vv-name="selectedMosaic"
    >
      <Option v-for="m in currentWalletMosaics" :key="m.id.toHex()" :value="m.id.toHex()">
        {{ mosaicService.getMosaicName(m.id) || m.id.toHex() }}
      </Option>
    </AutoComplete>
  </ErrorTooltip>
</template>

<script lang="ts">
import {MosaicSelectorTs} from './MosaicSelectorTs'
import './MosaicSelector.less'

export default class MosaicSelector extends MosaicSelectorTs {}
</script>
