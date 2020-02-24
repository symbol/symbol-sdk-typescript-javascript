<template>
  <FormRow>
    <template v-slot:label>
      {{ $t('form_label_remove_cosignatory') }}:
    </template>
    <template v-slot:inputs>
      <div class="row-cosignatory-action inputs-container">
        <div class="select-container">
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
        </div>
        <ButtonRemove
          class="button-add align-right"
          @click="onRemoveCosignatory"
        />
      </div>
    </template>
  </FormRow>
</template>

<script lang="ts">
import { RemoveCosignatoryInputTs } from './RemoveCosignatoryInputTs'

export default class RemoveCosignatoryInput extends RemoveCosignatoryInputTs {}
</script>
