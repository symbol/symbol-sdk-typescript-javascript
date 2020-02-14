<template>
  <div class="form-line-container">
    <FormLabel>{{ $t('transfer_target') }}</FormLabel>
    <ValidationProvider
      v-slot="{ errors }"
      mode="lazy"
      vid="recipient"
      :name="$t('recipient')"
      :rules="`${validationRules.addressOrAlias}|addressOrAliasNetworkType:${networkType}`"
      tag="div"
      class="inline-container"
    >
      <ErrorTooltip :errors="errors">
        <div class="full-width-item-container">
          <input
            v-model="rawValue"
            v-focus
            class="full-width-item-container input-size input-style"
            :placeholder="$t('placeholder_address_or_alias')"
            type="text"
            @blur="$emit('blur', rawValue)"
          >
        </div>
      </ErrorTooltip>
    </ValidationProvider>
  </div>
</template>

<script lang="ts">
import { RecipientInputTs } from './RecipientInputTs'
export default class RecipientInput extends RecipientInputTs {}
</script>
