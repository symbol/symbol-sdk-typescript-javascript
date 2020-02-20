<template>
  <div class="inline-container">
    <FormLabel v-if="label">
      {{ $t(label) }}
    </FormLabel>
    <ValidationProvider
      v-slot="{ errors }"
      vid="selectedMosaic"
      :name="$t(label)"
      :rules="'required'"
      tag="div"
    >
      <ErrorTooltip :errors="errors">
        <Select
          v-model="selectedMosaic"
          v-focus
          class="select-size select-style"
        >
          <Option 
            v-for="m in displayedMosaics"
            :key="m.getIdentifier()"
            :value="m.getIdentifier()"
          >
            {{ m.values.get('name') !== '' ? m.values.get('name') : m.values.get('hexId') }} 
          </Option>
        </Select>
      </ErrorTooltip>
    </ValidationProvider>
  </div>
</template>

<script lang="ts">
import {MosaicSelectorTs} from './MosaicSelectorTs'
export default class MosaicSelector extends MosaicSelectorTs {}
</script>
