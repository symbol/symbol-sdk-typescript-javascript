<template>
  <div>
    <ErrorTooltip field-name="selectedMosaic">
      <AutoComplete
        v-model="selectedMosaicName"
        v-focus
        class="auto-complete-size auto-complete-style"
        @on-change="onChange"
      >
        <Option 
          v-for="m in mosaics"
          :key="m.getIdentifier()"
          :label="m.values.get('name')"
          :value="m.values.get('name')"
        >
          {{ m.values.get('name') }} 
        </Option>
      </AutoComplete>
    </ErrorTooltip>
  </div>
</template>

<script lang="ts">
import {MosaicSelectorTs} from './MosaicSelectorTs'
export default class MosaicSelector extends MosaicSelectorTs {}
</script>
