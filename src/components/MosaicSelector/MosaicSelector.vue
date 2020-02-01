<template>
  <div class="asset">
    <ErrorTooltip field-name="selectedMosaic">
      <AutoComplete
        @on-change="onChange"
        class="type"
        v-model="selectedMosaicName"
        v-focus
        v-validate="'required|namespaceOrMosaicId'"
        data-vv-name="selectedMosaic"
      >
        <Option 
            v-for="m in mosaics"
            v-bind:key="m.id.toHex()"
            v-bind:label="getMosaicName(m.id)"
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
