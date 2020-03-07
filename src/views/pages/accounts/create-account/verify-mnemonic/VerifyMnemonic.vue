<template>
  <div class="check-mnemonic-sec">
    <div class="skip pointer" @click="$router.push({name: 'accounts.createAccount.finalize'})">
      {{ $t('skip') }}
    </div>
    <p class="set-title">
      {{ $t('Verify_mnemonics') }}
    </p>
    <div class="check-mnemonic-col">
      <div class="check-mnemonic-left">
        <MnemonicVerification
          :words="mnemonicWordsList"
          @success="$router.push({name: 'accounts.createAccount.finalize'})"
          @cancelled="$router.back()"
        />
      </div>
      <div class="check-mnemonic-right">
        <p class="text1">
          {{ $t('Tips') }}
        </p>
        <p class="text">
          {{ $t('The_backup_is_wrong') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import VerifyMnemonicTs from './VerifyMnemonicTs'
import './VerifyMnemonic.less'

export default class VerifyMnemonic extends VerifyMnemonicTs {}
</script>
