<template>
  <FormRow class-name="emphasis">
    <template v-slot:label>
      {{ $t('transfer_target') }}:
    </template>
    <template v-slot:inputs>
      <ValidationProvider
        v-slot="{ errors }"
        mode="lazy"
        vid="recipient"
        :name="$t('recipient')"
        :rules="`${validationRules.addressOrAlias}|addressOrAliasNetworkType:${networkType}`"
        tag="div"
        class="inputs-container"
      >
        <ErrorTooltip :errors="errors">
          <input
            v-model="rawValue"
            v-focus
            class="input-size input-style"
            :placeholder="$t('placeholder_address_or_alias')"
            type="text"
          >
        </ErrorTooltip> 
      </ValidationProvider>
    </template>
  </FormRow>
</template>

<script lang="ts">
import { RecipientInputTs } from './RecipientInputTs'
export default class RecipientInput extends RecipientInputTs {}
</script>
