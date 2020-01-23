<template>
  <div class="create-mnemonic-sec" @keyup.enter="$router.push({name: 'login.createAccount.verifyMnemonic'})">
    <p class="set-title">
      {{ $t('Backup_mnemonic') }}
    </p>
    <div class="create-mnemonic-col">
      <div class="create-mnemonic-left">
        <div class="mnemonic-container">
          <div v-if="!showMnemonic" class="show-mnemonic">
            <img src="@/common/img/invisible.png">
            <button @click="showMnemonic = true">
              {{ $t('Display_mnemonic') }}
            </button>
          </div>
          <div v-else class="mnemonic-list">
            <span v-for="(m, index) in mnemonicWordsList" :key="index">{{ m }}</span>
          </div>
        </div>

        <div class="button-container">
          <button class="info-button" @click="$router.back()">
            {{ $t('Back') }}
          </button>
          <button @click="$router.push({name: 'login.createAccount.verifyMnemonic'})">
            {{ $t('Verify_backup_mnemonics') }}
          </button>
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
import ShowMnemonicTs from '@/views/login/create-account/show-mnemonic/ShowMnemonicTs.ts'
export default class ShowMnemonic extends ShowMnemonicTs { }
</script>

<style scoped lang="less">
  @import "ShowMnemonic.less";
</style>
