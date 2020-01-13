<template>
  <Select
    v-model="inputValue"
    :placeholder="$t('publicKey')"
    class="fee-select"
  >
    <Option
      v-for="item in multisigPublicKeyList"
      :key="item.publicKey"
      :value="item.publicKey"
    >
      {{ item.label }}
    </Option>
  </Select>
</template>

<script lang="ts">
import { SignerSelectorTs } from '@/components/forms/inputs/signer-selector/SignerSelectorTs.ts'
export default class SignerSelector extends SignerSelectorTs {}
</script>
