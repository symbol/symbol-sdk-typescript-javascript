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
          :key="m.id.toHex()"
          :label="getMosaicName(m.id)"
          :value="getMosaicName(m.id)"
        >
          {{ getMosaicName(m.id) }} 
        </Option>
      </AutoComplete>
    </ErrorTooltip>
  </div>
</template>

<script lang="ts">
import {MosaicSelectorTs} from './MosaicSelectorTs'
import '@/styles/forms.less'
export default class MosaicSelector extends MosaicSelectorTs {}
</script>
