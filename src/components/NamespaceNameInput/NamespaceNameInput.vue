<template>
  <FormRow>
    <template v-slot:label>
      {{ $t('form_label_namespace_name') }}:
    </template>
    <template v-slot:inputs>
      <ValidationProvider
        v-slot="{ errors }"
        vid="form_label_namespace_name"
        :name="$t('form_label_namespace_name')"
        :rules="validationRule"
        tag="div"
        class="inputs-container"
      >
        <ErrorTooltip :errors="errors">
          <input
            v-if="isNeedAutoFocus"
            v-model="chosenValue"
            v-focus
            class="input-size input-style"
            :placeholder="$t('Input_namespace_name')"
            type="text"
          >
          <input
            v-else
            v-model="chosenValue"
            class="input-size input-style"
            :placeholder="$t('Input_namespace_name')"
            type="text"
          >
        </ErrorTooltip>
      </ValidationProvider>
    </template>
  </FormRow>
</template>

<script lang="ts">
import { NamespaceNameInputTs } from './NamespaceNameInputTs'
export default class NamespaceNameInput extends NamespaceNameInputTs {}
</script>
