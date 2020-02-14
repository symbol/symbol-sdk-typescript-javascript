<template>
  <div class="form-line-container">
    <FormLabel>{{ $t('form_label_remove_cosignatory') }}</FormLabel>
    <div class="inline-container full-width-item-container">
      <Select
        v-model="cosignatory"
        class="select-size select-style"
      >
        <Option
          v-for="{publicKey} in cosignatories"
          :key="publicKey"
          :value="publicKey"
        >
          {{ getAddressFromPublicKey(publicKey) }}
        </Option>
      </Select>
      <div class="button-container">
        <button
          class="right-side-round-button round-button red"
          @click="onRemoveCosignatory"
        >
          <Icon type="md-remove-circle" />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { RemoveCosignatoryInputTs } from './RemoveCosignatoryInputTs'

export default class RemoveCosignatoryInput extends RemoveCosignatoryInputTs {}
</script>
