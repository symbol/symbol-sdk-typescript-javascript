<template>
  <div class="form-line-container">
    <FormLabel>{{ $t('form_label_namespace_name') }}</FormLabel>
    <ValidationProvider
      v-slot="{ errors }"
      mode="lazy"
      vid="form_label_namespace_name"
      :name="$t('form_label_namespace_name')"
      :rules="validationRule"
      tag="div"
      class="inline-container"
    >
      <ErrorTooltip :errors="errors">
        <div class="full-width-item-container">
          <input
            v-model="chosenValue"
            v-focus
            class="full-width-item-container input-size input-style"
            :placeholder="$t('Input_namespace_name')"
            type="text"
          >
        </div>
      </ErrorTooltip>
    </ValidationProvider>
  </div>
</template>

<script lang="ts">
import { NamespaceNameInputTs } from './NamespaceNameInputTs'
export default class NamespaceNameInput extends NamespaceNameInputTs {}
</script>
