<template>
  <Select
    v-model="chosenSigner"
    :placeholder="$t('publicKey')"
    class="fee-select"
  >
    <Option
      v-for="item in signers"
      :key="item.publicKey"
      :value="item.publicKey"
    >
      {{ item.label }}
    </Option>
  </Select>
</template>

<script lang="ts">
import { SignerSelectorTs } from './SignerSelectorTs'
export default class SignerSelector extends SignerSelectorTs {}
</script>
