<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <ValidationProvider
      v-slot="{ errors }"
      mode="lazy"
      vid="cosignatory"
      :name="$t('cosignatory')"
      :rules="`${validationRules.addressOrPublicKey}`"
      class="form-line-container"
      tag="div"
    >
      <FormLabel>{{ $t('form_label_add_cosignatory') }}</FormLabel>
      <div class="inline-container full-width-item-container">
        <ErrorTooltip :errors="errors">
          <input
            v-model="cosignatory"
            :placeholder="$t('placeholder_address_or_public_key')"
            class="input-style input-size"
            type="text"
          >
        </ErrorTooltip>
        <div class="button-container">
          <button
            class="right-side-round-button round-button"
            @click="handleSubmit(onAddCosignatory)"
          >
            <Icon type="md-add-circle" />
          </button>
        </div>
      </div>
    </ValidationProvider>
  </ValidationObserver>
</template>

<script lang="ts">
import { AddCosignatoryInputTs } from './AddCosignatoryInputTs'

export default class AddCosignatoryInput extends AddCosignatoryInputTs {}
</script>
