<template>
  <div class="target flex_center">
    <span class="title">{{ $t('FormTransferCreation_target') }}</span>
    <span class="value radius flex_center">

      <ErrorTooltip field-name="recipient" placement-override="top">
        <input
          v-model="rawValue"
          v-focus
          v-validate="validationRules.addressOrAlias"
          data-vv-name="recipient"
          :data-vv-as="$t('FormTransferCreation_target')"
          :placeholder="$t('receive_address_or_alias')"
          type="text"
        />
      </ErrorTooltip>

    </span>
  </div>
</template>

<script lang="ts">
import {RecipientInputTs} from './RecipientInputTs'

export default class RecipientInput extends RecipientInputTs {}
</script>
