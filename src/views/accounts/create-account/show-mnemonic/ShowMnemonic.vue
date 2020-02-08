<template>
  <div class="create-mnemonic-sec" @keyup.enter="$router.push({name: 'accounts.createAccount.verifyMnemonic'})">
    <p class="set-title">
      {{ $t('Backup_mnemonic') }}
    </p>
    <div class="create-mnemonic-col">
      <div class="create-mnemonic-left">
        <div class="mnemonic-container">
          <div v-if="!showMnemonic" class="show-mnemonic">
            <img src="@/views/resources/img/invisible.png">
            <button
              class="button-style validation-button"
              @click="showMnemonic = true"
            >
              {{ $t('Display_mnemonic') }}
            </button>
          </div>
          <div v-else class="mnemonic-list">
            <span v-for="(m, index) in mnemonicWordsList" :key="index">{{ m }}</span>
          </div>
        </div>
        <div class="form-line-container button-container">
          <div class="flex-container mt-3">
            <button
              type="button"
              class="button-style back-button" 
              @click="$router.back()"
            >
              {{ $t('back') }}
            </button>
            <button
              type="submit"
              class="button-style validation-button" 
              @click="$router.push({name: 'accounts.createAccount.verifyMnemonic'})"
            >
              {{ $t('Verify_backup_mnemonics') }}
            </button>   
          </div>
        </div>
      </div>
      <div class="create-mnemonic-right">
        <p class="text1">
          {{ $t('Tips') }}
        </p>
        <p class="text">
          {{ $t('Don_not_disclose') }}
        </p>
        <p class="text">
          {{ $t('Please_write_your_supporting_words') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ShowMnemonicTs from './ShowMnemonicTs'
import './ShowMnemonic.less'
export default class ShowMnemonic extends ShowMnemonicTs { }
</script>
