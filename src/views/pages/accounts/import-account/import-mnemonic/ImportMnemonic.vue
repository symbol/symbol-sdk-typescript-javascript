<template>
  <div class="create-mnemonic-sec" @keyup.enter="submit">
    <p class="set-title">
      {{ $t('Input_mnemonic') }}
    </p>
    <div class="create-mnemonic-col">
      <div class="create-mnemonic-left">
        <MnemonicInput @handle-words="setSeed" />
        <div class="button-container">
          <div class="flex-container mt-3">
            <button type="button" class="button-style back-button" @click="deleteAccountAndBack">
              {{ $t('Return_password_setting') }}
            </button>
            <button
              type="submit"
              class="button-style validation-button"
              :disabled="!(wordsArray.length === 12 || wordsArray.length === 24)"
              @click="processVerification"
            >
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

export default class ImportMnemonic extends ImportMnemonicTs {}
</script>
<style lang="less" scoped>
@import "./ImportMnemonic.less";
</style>
