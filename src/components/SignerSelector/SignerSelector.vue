<template>
  <FormRow class-name="emphasis">
    <template v-slot:label>
      {{ $t('sender') }}:
    </template>
    <template v-slot:inputs>
      <div class="inputs-container select-container">
        <select
          v-model="chosenSigner"
          :placeholder="$t('publicKey')"
          class="select-size select-style"
        >
          <option
            v-for="item in signers"
            :key="item.publicKey"
            :value="item.publicKey"
          >
            {{ item.label }}
          </option>
        </select>
      </div>
    </template>
  </FormRow>
</template>


<script lang="ts">
import { SignerSelectorTs } from './SignerSelectorTs'
export default class SignerSelector extends SignerSelectorTs {}
</script>
