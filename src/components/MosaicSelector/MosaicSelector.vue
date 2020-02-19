<template>
  <div class="inline-container">
    <FormLabel v-if="label">
      {{ $t(label) }}
    </FormLabel>
    <ErrorTooltip field-name="selectedMosaic">
      <Select
        v-model="selectedMosaicName"
        v-focus
        class="select-size select-style"
        @on-change="onChange"
      >
        <Option 
          v-for="m in displayedMosaics"
          :key="m.getIdentifier()"
          :value="m.values.get('name')"
        >
          {{ m.values.get('name') !== '' ? m.values.get('name') : m.values.get('hexId') }} 
        </Option>
      </Select>
    </ErrorTooltip>
  </div>
</template>

<script lang="ts">
import {MosaicSelectorTs} from './MosaicSelectorTs'
export default class MosaicSelector extends MosaicSelectorTs {}
</script>
