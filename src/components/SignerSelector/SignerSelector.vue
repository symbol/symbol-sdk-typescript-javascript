<template>
  <FormRow class-name="emphasis" :no-label="noLabel">
    <template v-slot:label>
      <div v-if="!noLabel">
        {{ $t(label) }}:
      </div>
    </template>
    <template v-slot:inputs>
      <div v-if="signers.length > 1" class="inputs-container select-container">
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
      <div v-else class="signer-selector-single-signer-container">
        <span>
          {{ signers[0] ? signers[0].label : '' }}
        </span>
      </div>
    </template>
  </FormRow>
</template>


<script lang="ts">
import { SignerSelectorTs } from './SignerSelectorTs'
export default class SignerSelector extends SignerSelectorTs {}
</script>
