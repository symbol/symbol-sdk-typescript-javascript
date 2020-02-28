<template>
  <FormRow>
    <template v-slot:inputs>
      <ValidationObserver
        v-slot="{ handleSubmit }"
        slim
      >
        <ValidationProvider
          v-slot="{ errors }"
          vid="cosignatory"
          :name="$t('cosignatory')"
          :rules="`${validationRules.addressOrPublicKey}`"  
          tag="div"
          class="row-cosignatory-action inputs-container"
        >
          <div class="input-container">
            <ErrorTooltip :errors="errors">
              <input
                v-model="cosignatory"
                :placeholder="$t('placeholder_address_or_public_key')"
                class="input-style input-size"
                type="text"
              >
            </ErrorTooltip>
          </div>
          <ButtonAdd
            class="button-add align-right"
            @click="handleSubmit(onAddCosignatory)"
          />
        </ValidationProvider>
      </ValidationObserver>
    </template>
  </FormRow>
</template>

<script lang="ts">
import { AddCosignatoryInputTs } from './AddCosignatoryInputTs'

export default class AddCosignatoryInput extends AddCosignatoryInputTs {}
</script>
