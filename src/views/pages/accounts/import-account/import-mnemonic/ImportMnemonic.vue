<template>
  <div class="create-mnemonic-sec" @keyup.enter="submit">
    <p class="set-title">
      {{ $t('Input_mnemonic') }}
    </p>
    <div class="create-mnemonic-col">
      <div class="create-mnemonic-left">
        <textarea v-model="formItems.seed" class="show-mnemonic" />
        <div class="button-container">
          <div class="flex-container mt-3">
            <button type="button" class="button-style back-button" @click="deleteAccountAndBack">
              {{ $t('Return_password_setting') }}
            </button>
            <button type="submit" class="button-style validation-button" @click="processVerification">
              {{ $t('Import_mnemonic') }}
            </button>
          </div>
        </div>
      </div>
      <div class="create-mnemonic-right">
        <p class="text">
          {{ $t('Input_mnemonic_tips') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ImportMnemonicTs from './ImportMnemonicTs'
import './ImportMnemonic.less'

export default class ImportMnemonic extends ImportMnemonicTs {}
</script>
