<template>
  <div class="form-line-container">
    <FormLabel>{{ $t('sender') }}</FormLabel>
    <div class="inline-container">
      <div class="full-width-item-container">
        <Select
          v-model="chosenSigner"
          :placeholder="$t('publicKey')"
          class="select-size select-style"
        >
          <Option
            v-for="item in signers"
            :key="item.publicKey"
            :value="item.publicKey"
          >
            {{ item.label }}
          </Option>
        </Select>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { SignerSelectorTs } from '@/components/SignerSelector/SignerSelectorTs.ts'
import '@/styles/forms.less'
export default class SignerSelector extends SignerSelectorTs {}
</script>
