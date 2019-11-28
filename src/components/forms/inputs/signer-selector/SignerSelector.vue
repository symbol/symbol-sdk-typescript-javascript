<template>
  <Select
   :placeholder="$t('publicKey')"
   v-model="inputValue"
   class="fee-select"
  >
    <Option
      v-for="item in multisigPublicKeyList"
      :value="item.publicKey"
      :key="item.publicKey"
    >{{ item.label }}</Option>
  </Select>
</template>

<script lang="ts">
import { SignerSelectorTs } from "@/components/forms/inputs/signer-selector/SignerSelectorTs.ts";
export default class SignerSelector extends SignerSelectorTs {}
</script>
